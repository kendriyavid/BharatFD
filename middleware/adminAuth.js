const jwt = require("jsonwebtoken");
const User = require("../models/user.js"); 
const secretKey = process.env.JWT_SECRET; 

const verifyAdmin = async (req, res, next) => {
    try {
        console.log(req.headers)
        const token = req.headers.authorization?.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

module.exports = verifyAdmin;
