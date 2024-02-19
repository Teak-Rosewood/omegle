import { Socket } from "socket.io";
import { RoomManager } from "./RoomManger";

export interface UserProp {
    name: string;
    socket: Socket;
}
export class UserManager {
    private users: UserProp[];
    private queue: string[];
    private room_manager: RoomManager;

    constructor() {
        this.users = [];
        this.queue = [];
        this.room_manager = new RoomManager();
    }

    createUser(name: string, socket: Socket) {
        this.users.push({
            name: name,
            socket: socket,
        });
        this.queue.push(socket.id);
        socket.emit("lobby", true);
        socket.on;
        this.initHandeler(socket);
        this.clearQueue();
    }

    exchangeMessage(roomId: string, message: string, senderSocketID: string) {
        const room = this.room_manager.rooms.get(roomId);
        if (!room) return;
        const receivingUser = room.user1.socket.id === senderSocketID ? room.user2 : room.user1;
        receivingUser.socket.emit("new-message", { message: message });
    }

    removeUser(SocketID: string) {
        const room = Array.from(this.room_manager.rooms.entries()).find(([key, value]) => {
            return SocketID === value.user1.socket.id || SocketID === value.user2.socket.id;
        });

        if (room) {
            const receivingUser = SocketID !== room[1].user1.socket.id ? room[1].user1 : room[1].user2;
            receivingUser.socket.emit("switch-user");
            receivingUser.socket.emit("lobby", true);
            this.room_manager.rooms.delete(room[0]);
        }
        this.users = this.users.filter((user) => user.socket.id !== SocketID);
        this.queue = this.queue.filter((id) => id !== SocketID);

        this.clearQueue();
    }

    clearQueue() {
        if (this.queue.length < 2) return;

        const id1 = this.queue.pop();
        const id2 = this.queue.pop();

        const user1 = this.users.find((x) => x.socket.id === id1);
        const user2 = this.users.find((x) => x.socket.id === id2);

        if (!user1 || !user2) return;
        this.room_manager.createRoom(user1, user2);
        this.clearQueue();
    }

    initHandeler(socket: Socket) {
        socket.on("send-message", ({ roomId, message }) => {
            this.exchangeMessage(roomId, message, socket.id);
        });
        socket.on("offer", ({ sdp, roomId, username }) => {
            this.room_manager.onOffer(roomId, sdp, socket.id, username);
        });
        socket.on("answer", ({ sdp, room_id, username }) => {
            this.room_manager.onAnswer(room_id, sdp, socket.id, username);
        });
    }
}
