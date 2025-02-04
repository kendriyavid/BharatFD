import dotenv from 'dotenv';
dotenv.config();
import Redis from 'ioredis';
console.log(process.env.REDIS_HOST,process.env.REDIS_PORT,process.env.REDIS_PASSWORD)

// const redisClient = new Redis({
//     host: process.env.REDIS_HOST || "localhost",  // Use the container name in Docker
//     port: process.env.REDIS_PORT || 6379,        // Default Redis port
// });

const redisClient = new Redis({
    host: process.env.REDIS_HOST,  // Use the container name in Docker
    port: process.env.REDIS_PORT,         // Default Redis port
    password:process.env.REDIS_PASSWORD,
    tls:{}
});

redisClient.ping((err, result) => {
    if (err) console.error("Error connecting to Redis:", err);
    else console.log("Redis response:", result);  // Should log "PONG"
});

export default redisClient;
