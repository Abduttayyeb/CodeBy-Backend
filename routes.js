const express = require("express");
const router = express.Router();
const { createRoom, getCode } = require("./controllers");

router.post("/create-room", createRoom);
router.get("/code/:roomId", getCode);

module.exports = router;
