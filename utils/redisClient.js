import dotenv from 'dotenv';
dotenv.config();
import Redis from 'ioredis';

const redisClient = new Redis({
    host:"redis-local",  
    port:6379
});

redisClient.ping((err, result) => {
    if (err) console.error("Error connecting to Redis:", err);
    else console.log("Redis response:", result); 
});

export default redisClient;
