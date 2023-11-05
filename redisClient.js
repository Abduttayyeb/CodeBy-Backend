const redis = require("redis");

let redisClient;

(async () => {
    redisClient = redis.createClient({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
    });
    redisClient.on("error", (error) => {
        console.log(process.env.REDIS_HOST)
        console.log(process.env.REDIS_PORT)
        console.error("Redis Error:", error);
    });
    // await redisClient.connect();
    redisClient.get('ping',(err,pings) => {
        console.log(pings)
    })
    console.log(
        `Redis -\tclient.isOpen: ${redisClient.isOpen}, client.isReady: ${redisClient.isReady}`
    );
})();

module.exports = redisClient;
