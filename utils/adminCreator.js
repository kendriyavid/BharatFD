import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.js'; // Assuming User model is properly defined

dotenv.config();

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

const createAdminUser = async () => {
    try {
        await dbConnection();

        const hashedPassword = await bcrypt.hash('yourSecurePassword', 10);

        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });

        await adminUser.save();
        console.log('Admin user created!');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();
