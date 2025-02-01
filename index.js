const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const redisClient = require('./utils/redisClient.js'); // Assuming redisClient.js is in the same directory
const Faq = require('./models/faq.js');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// db connection
const dbConnection = async () => {
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}`);
        console.log("connected to the database");

        // After DB connection, connect to Redis and update FAQ IDs cache
        await updateFaqIdsInCache();
    } catch (error) {
        console.log("database connection failed: ", error);
    }
};

// Redis client update function
const updateFaqIdsInCache = async () => {
    try {
        // Fetch all FAQ IDs from the database
        const faqIds = await Faq.find().select('faqId'); // Query database for all FAQ IDs
        await redisClient.set('faqIds:en', JSON.stringify(faqIds.map(faq => faq.faqId)));
        console.log('FAQ IDs stored in Redis cache');
    } catch (error) {
        console.error('Error updating FAQ IDs in cache:', error);
    }
};

// Initialize the database connection and cache the FAQ IDs
dbConnection();

const corsOptions = {
    origin: "http://localhost:5173",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("hi there");
});

app.use('/api/faqs', require('./router/client.js'));
app.use("/api/admin", require("./router/admin.js"));

app.listen(port, () => {
    console.log("the application is running");
});
