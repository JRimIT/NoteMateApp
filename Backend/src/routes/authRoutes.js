import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Book from '../models/Book.js';
import protectRoute from '../middleware/auth.middleware.js';

dotenv.config();

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '5h' });
}

// router.post('/signup', signup);
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body
        console.log("Registering user:", { email, username, password });

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters long" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;



        const user = new User({
            username,
            email,
            password,
            profileImage
        });

        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createAt: user.createdAt
            },
            token
        });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ message: "Internal server error" });
    }


});
router.post('/favorite/:bookId', protectRoute, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const { bookId } = req.params;
      if (!user.favorites.includes(bookId)) {
        user.favorites.push(bookId);
        await user.save();
      }
      res.json({ message: 'Đã thêm vào yêu thích' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Bỏ khỏi yêu thích
  router.delete('/favorite/:bookId', protectRoute, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const { bookId } = req.params;
      user.favorites = user.favorites.filter(id => id.toString() !== bookId);
      await user.save();
      res.json({ message: 'Đã bỏ khỏi yêu thích' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Lấy danh sách book yêu thích
  router.get('/favorites', protectRoute, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate({
        path: 'favorites',
        populate: { path: 'user', select: 'username profileImage' }
      });
      res.json(user.favorites);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });



export default router;