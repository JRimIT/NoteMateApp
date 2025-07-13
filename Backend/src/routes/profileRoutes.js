// routes/profileRoutes.js
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import User from "../models/User.js";

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

// PUT /profile/me - Update current user profile
router.put("/me", protectRoute, async (req, res) => {
  const { username, email, profileImage } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.profileImage = profileImage || user.profileImage;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
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

export default router;
