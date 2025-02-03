const Redis = require('ioredis');


const redis = new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
    tls:{}
});

redis.ping()
  .then(result => console.log("Redis response:", result)) // Should log "PONG"
  .catch(err => console.error("Error connecting to Redis:", err));

module.exports = redis;
