const Redis = require('ioredis');  

const redisClient = new Redis({
    host: 'localhost',  // or your Redis container IP if using Docker
    port: 6379,         // default Redis port
});

redisClient.ping((err, result) => {
    if (err) console.error("Error connecting to Redis:", err);
    else console.log("Redis response:", result);  // Should log "PONG"
});

module.exports = redisClient