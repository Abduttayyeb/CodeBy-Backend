const redis = require("redis");

let redisClient;

(async () => {
    redisClient = redis.createClient();
    redisClient.on("error", (error) => {
        console.error("Redis Error:", error);
    });
    await redisClient.connect();
    console.log(
        `Redis -\tclient.isOpen: ${redisClient.isOpen}, client.isReady: ${redisClient.isReady}`
    );
})();

module.exports = redisClient;
