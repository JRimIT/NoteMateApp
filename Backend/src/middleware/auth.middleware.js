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
const handleCreateBook = async () => {
    const response = await fetch(`${BACKEND_URL}/api/books`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title, caption, image, rating, content, tags
      }),
    });
    const text = await response.text();
    console.log('Response text:', text); // <-- Thêm dòng này để xem backend trả về gì
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Không parse được JSON:', e);
      return;
    }
    // ...xử lý tiếp
  };
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

