// routes/profileRoutes.js
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

// GET /profile/me - Get current user profile
router.get("/me", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /profile/change-password
router.put("/change-password", protectRoute, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword?.trim() || !newPassword?.trim()) {
    return res
      .status(400)
      .json({ message: "Both current and new password are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "New password must be at least 6 characters" });
  }

  try {
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword; // Will be hashed by Mongoose pre-save
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /profile/avatar - Cập nhật ảnh đại diện
router.put("/avatar", protectRoute, async (req, res) => {
  const { profileImage } = req.body;

  if (!profileImage || !profileImage.startsWith("data:image")) {
    return res.status(400).json({ message: "Valid base64 image is required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optional: Xóa ảnh cũ trên Cloudinary nếu cần
    if (user.profileImage?.includes("cloudinary")) {
      try {
        const publicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      } catch (e) {
        console.warn("Old image deletion failed:", e.message);
      }
    }

    // Upload ảnh mới lên Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profileImage, {
      folder: "avatars",
    });

    user.profileImage = uploadResponse.secure_url;
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    res.json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// PUT /profile/updateInfo - Cập nhật username,email người dùng
router.put("/updateInfo", protectRoute, async (req, res) => {
  const userId = req.user.id;
  const { username, email } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { username, email },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
});

// DELETE /profile/delete - Xóa tài khoản người dùng
router.delete("/delete", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Xóa avatar từ Cloudinary nếu có
    if (user.profileImage?.includes("cloudinary")) {
      try {
        const publicId = user.profileImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      } catch (e) {
        console.warn("Old image deletion failed:", e.message);
      }
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
