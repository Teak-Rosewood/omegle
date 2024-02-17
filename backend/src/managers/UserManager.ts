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
        this.clearQueue();
    }

    removeUser(SocketID: string) {
        this.users = this.users.filter((user) => user.socket.id !== SocketID);
        this.queue = this.queue.filter((id) => id !== SocketID);
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
}
