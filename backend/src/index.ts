import { Socket } from "socket.io";
import express from "express";
import { UserManager } from "./managers/UserManager";
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);

let total_connections = 0;
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(express.json());
app.get("/", (req, res) => {
    res.json({
        message: "eh",
    });
});

const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
    console.log("Total Connections:", ++total_connections);
    userManager.createUser("user-" + total_connections.toString(), socket);
    socket.on("disconnect", () => {
        total_connections--;
        // console.log("Total Connections:", total_connections--);
        userManager.removeUser(socket.id);
    });
});

server.listen(3001, () => {
    console.log("server running at http://localhost:3001");
});
