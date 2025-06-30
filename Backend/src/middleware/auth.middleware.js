import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// const response = await fetch(`http://localhost:3000/api/books`, {
//     method: 'POST',
//     boby: JSON.stringify({
//         title: "Sample Book",
//         caption: "This is a sample book caption.",

//     }), headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//     }
// });

const protectRoute = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        console.log("decoded: ", decoded);


        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({ message: error.message });
    }
}

export default protectRoute;

