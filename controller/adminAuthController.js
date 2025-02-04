import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import validator from "validator";

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 4) {
        return res.status(400).json({ message: "Password must be at least 4 characters long" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);

        res.json({
            accessToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export { login };
