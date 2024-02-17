import { UserProp } from "./UserManager";

let ROOM_ID = 0;

interface Room {
    user1: UserProp;
    user2: UserProp;
}

export class RoomManager {
    rooms: Map<string, Room>;
    constructor() {
        this.rooms = new Map<string, Room>();
    }

    createRoom(user1: UserProp, user2: UserProp) {
        const id = this.generate().toString();
        this.rooms.set(id, { user1: user1, user2: user2 });

        user1.socket.emit("offer", { id });
        user2.socket.emit("offer", { id });
    }

    onOffer(roomId: string, sdp: string, senderSocketID: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;
        const receivingUser = room.user1.socket.id === senderSocketID ? room.user1 : room.user2;
        receivingUser.socket.emit("offer", { sdp, roomId });
    }

    onAnswer(roomId: string, sdp: string, senderSocketID: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;
        const receivingUser = room.user1.socket.id === senderSocketID ? room.user1 : room.user2;
        receivingUser.socket.emit("answer", { sdp, roomId });
    }

    generate() {
        return ROOM_ID++;
    }
}
