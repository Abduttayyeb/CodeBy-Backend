const moment = require("moment/moment");
const redisClient = require("./redisClient.js");

async function createRoom(req, res) {
    console.log("Route - createRoom");
    const { roomId } = req.body;

    try {
        await redisClient.hSet(`${roomId}`, {
            created: moment().toString(),
            updated: moment().toString(),
        });
        res.status(201).json({ status: "success", message: "Room Created Successfully" });
    } catch (err) {
        console.log("Redis Set Error :: ", err);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}

async function getCode(req, res) {
    console.log("Route - getCode");
    const { roomId } = req.params;

    try {
        const data = await redisClient.hGet("code_contents", roomId);
        res.status(200).json({ status: "success", contents: data });
    } catch (err) {
        console.error("Redis Get Error:", err);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}

module.exports = { createRoom, getCode };
