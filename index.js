import dotenv from 'dotenv';
dotenv.config();
console.log("loaded")
console.log(process.env.REDIS_HOST, process.env.DATABASE_URI)
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

import redisClient from './utils/redisClient.js'; // Assuming redisClient.js is in the same directory
import Faq from './models/faq.js';

import { updateFaqIdsInCache } from './utils/redisFaqState.js';
import { login } from './controller/adminAuthController.js';


const app = express();
const port = process.env.PORT || 3000;

// db connection
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            tls: true,
            retryWrites: true,
            maxPoolSize: 10
        });
        console.log('Database connected successfully');

        // After DB connection, connect to Redis and update FAQ IDs cache
        await updateFaqIdsInCache();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

// Initialize the database connection and cache the FAQ IDs
dbConnection();

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('hi there');
});

app.post('/adminlogin', login);

// Use async function to handle dynamic import for routes
const loadRoutes = async () => {
    const clientRouter = (await import('./router/client.js')).default;
    const adminRouter = (await import('./router/admin.js')).default;

    app.use('/api/faqs', clientRouter);
    app.use('/api/admin', adminRouter);
};

// Load routes dynamically
loadRoutes();

app.listen(port, () => {
    console.log('The application is running');
});

export default app;
