import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';

import redisClient from './utils/redisClient.js';
import Faq from './models/faq.js';
import { updateFaqIdsInCache } from './utils/redisFaqState.js';
import { login } from './controller/adminAuthController.js';



const app = express();
const port = process.env.PORT || 3000;

export const dbConnection = async () => {
    if (process.env.NODE_ENV !== 'test') {
        try {
            await mongoose.connect(process.env.DATABASE_URI, {
                ssl: true,
                tls: true,
                retryWrites: true,
                maxPoolSize: 10
            });
            console.log('Database connected successfully');

            await updateFaqIdsInCache();
        } catch (error) {
            console.error('Database connection failed:', error);
        }
    }
};

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

const loadRoutes = async () => {
    const clientRouter = (await import('./router/client.js')).default;
    const adminRouter = (await import('./router/admin.js')).default;

    app.use('/api/faqs', clientRouter);
    app.use('/api/admin', adminRouter);
};

loadRoutes();

if (process.env.NODE_ENV !== 'test') {
    dbConnection();
    app.listen(port, () => {
        console.log('The application is running');
    });
}

export default app;