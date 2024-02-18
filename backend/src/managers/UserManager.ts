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
        // setInte0);
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

    removeUser(SocketID: string) {
        Array.from(this.room_manager.rooms.entries()).find(([key, value]) => {
            return SocketID === value.user1.socket.id || SocketID === value.user2.socket.id;
        });

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
        socket.on("offer", ({ sdp, roomId, username }) => {
            this.room_manager.onOffer(roomId, sdp, socket.id, username);
        });
        socket.on("answer", ({ sdp, room_id, username }) => {
            this.room_manager.onAnswer(room_id, sdp, socket.id, username);
        });
    }
}
