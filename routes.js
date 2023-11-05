const express = require("express");
const router = express.Router();
const { createRoom, getCode } = require("./controllers");

router.post("/create-room", createRoom);
router.get("/code/:roomId", getCode);
router.get("/test", (req,res)=>{
    res.status(200).json({message:"Working..!"})
} );

module.exports = router;
