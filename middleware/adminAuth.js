import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Assuming you have a User model
const secretKey = process.env.JWT_SECRET;

const verifyAdmin = async (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = user; // Attach user info to request
        next(); // Proceed to the next function
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

export default verifyAdmin;
