const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Faq = require('./models/faq.js')


dotenv.config();
const app = express();
const port = process.env.PORT||3000

// db connection 
const dbConnection = async()=>{
    try{
        mongoose.connect(`${process.env.DATABASE_URL}`)
        console.log("connected to the database")
    }catch(error){
        console.log("database connection failed: ",error)

    }
}
dbConnection()
const corsOptions = {
    origin:"http://localhost:5173"
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());

app.get("/",(req,res)   =>{
    res.send("hi there");
})

app.post("/create",async (req,res)=>{
    console.log(req.body)
    const {question,response} = req.body
    const faq = new Faq({question,response});
    await faq.save();
    res.status(201).send("created record successfully")
})

app.use('/api/faqs',require('./router/client.js'))
app.use("/api/admin",require("./router/admin.js"))


app.listen(port,()=>{
    console.log("the application is runninng")
})
