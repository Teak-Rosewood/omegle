import { Request, Response } from "express";
import { Socket } from "socket.io";
import express from "express";
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.get("/", (req, res) => {
    res.json({
        message: "eh",
    });
});

io.on("connection", (socket: Socket) => {
    console.log("a user connected");
});

server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
});
