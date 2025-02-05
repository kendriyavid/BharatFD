const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const redisClient = require('./utils/redisClient.js'); // Assuming redisClient.js is in the same directory
const Faq = require('./models/faq.js');
const {updateFaqIdsInCache} = require("./utils/redisFaqState.js")
const {login} = require("./controller/adminAuthController.js")
// const uri  = `mongodb+srv://harshdeep7thc:${process.env.DATABASE_PASSWORD}@cluster0.fe2w5lj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const app = express();
const port = process.env.PORT || 3000;


const dbConnection = async () => {
    try {
        // await mongoose.connect(process.env.DATABASE_URI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // });

        // await mongoose.connect(process.env.DATABASE_URI, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     ssl: true,
        //     sslValidate: true,
        //     tls: true,
        //     tlsAllowInvalidCertificates: false,
        //     retryWrites: true,
        //     maxPoolSize: 10,
        //     serverSelectionTimeoutMS: 5000,
        //     socketTimeoutMS: 45000,
        //   });
          
        // console.log("Connected to MongoDB Atlas");

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
        console.error("Database connection failed:", error);
    }
};



// Initialize the database connection and cache the FAQ IDs
dbConnection();

const corsOptions = {
    origin: ["https://bharatfrontend.onrender.com", "http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("hi there");
});

app.post("/adminlogin",login);

app.use('/api/faqs', require('./router/client.js'));
app.use("/api/admin", require("./router/admin.js"));

app.listen(port, () => {
    console.log("the application is running");
});
