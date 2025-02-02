const Redis = require('ioredis');

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",  // Use the container name in Docker
    port: process.env.REDIS_PORT || 6379,        // Default Redis port
});

// const redisClient = new Redis({
//     host: "localhost",  // Use the container name in Docker
//     port: 6379,        // Default Redis port
// });


redisClient.ping((err, result) => {
    if (err) console.error("Error connecting to Redis:", err);
    else console.log("Redis response:", result);  // Should log "PONG"
});

module.exports = redisClient;
