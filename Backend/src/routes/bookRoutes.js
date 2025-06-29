import express from 'express';
import { mongo } from 'mongoose';
// import router from './authRoutes.js';
import cloudinary from '../lib/cloudinary.js';
import protectRoute from '../middleware/auth.middleware.js';
import Book from '../models/Book.js';
const router = express.Router();

router.post('/', protectRoute, async (req, res) => {
    // console.log("Received book data:", req.body);
    try {
        const { title, caption, image, rating } = req.body;
        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id // Assuming req.user is set after authentication
        });

        // console.log("New book data:", newBook);


        await newBook.save();
        res.status(201).json({
            message: "Book added successfully",
            book: {
                _id: newBook._id,
                title: newBook.title,
                caption: newBook.caption,
                image: newBook.image,
                rating: newBook.rating,
                user: newBook.user
            }
        });


    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: error.message || "Internal server error loi do" });
    }
})

router.get('/', protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 2;
        const skip = (page - 1) * limit;



        const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user', 'username profileImage');

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page
        });
        // res.status(200).json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/user', protectRoute, async (req, res) => {
    try {
        const userId = req.user._id;
        const books = await Book.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({ books: books });
    } catch (error) {
        console.error("Error fetching user books:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete('/:id', protectRoute, async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this book" });
        }

        // Optionally, delete the image from cloudinary if needed
        if (book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);

            } catch (error) {
                console.error("Error deleting image from cloudinary:", error);
                return res.status(500).json({ message: "Error deleting image" });
            }
        }

        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;