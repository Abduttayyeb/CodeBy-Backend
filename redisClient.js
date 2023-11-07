const redis = require("redis");

let redisClient;

(async () => {
    redisClient = redis.createClient({ url: process.env.REDIS_URL });
    redisClient.on("error", (error) => {
        console.log(process.env.REDIS_HOST);
        console.log(process.env.REDIS_PORT);
        console.error("Redis Error:", error);
    });
    await redisClient.connect();
    redisClient.get("ping", (err, pings) => {
        console.log(pings);
    });
    console.log(
        `Redis -\tclient.isOpen: ${redisClient.isOpen}, client.isReady: ${redisClient.isReady}`
    );
})();

module.exports = redisClient;
