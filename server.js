const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const socketEvents = require("./socketEvents");
const redisClient = require("./redisClient");
const routes = require("./routes.js");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const userSocketMap = {};

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [process.env.REACT_APP_FRONTED_URL],
    })
);

app.use(express.json());
app.use("/", routes);

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

io.on("connection", (socket) => {
    console.log("\n--New Socket Connected--", socket.id);

    // TODO : 1) TO PERSIST CONNECTIONS ON PAGE REFRESH
    //        2) TO SAVE THE CODE STATE FOR ROOM [DONE].

    socket.on(socketEvents.JOIN, ({ currentUsername, roomId }) => {
        console.log("\tUser Joined ", { currentUsername, roomId });

        userSocketMap[socket.id] = currentUsername;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        console.log("\tClients Connected to room: ", clients);

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(socketEvents.JOINED, {
                clients,
                username: currentUsername,
                socketId: socket.id, // Socket ID of user who want's to join
            });
        });
    });

    socket.on(socketEvents.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(socketEvents.CODE_CHANGE, { code });
        redisClient.hSet("code_contents", roomId, code);
    });

    socket.on("disconnecting", () => {
        console.log("\n--Socket Disconnecting--", socket.id);
        const rooms = [...socket.rooms]; // rooms to which the current user is connected to, & converting it to array
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(socketEvents.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT}`);
});
