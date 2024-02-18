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
        console.log("created a room for " + user1.name + " and " + user2.name);
        const id = this.generate().toString();
        this.rooms.set(id, { user1: user1, user2: user2 });
        user1.socket.emit("send-offer", { roomId: id });
    }

    onOffer(roomId: string, sdp: string, senderSocketID: string, username: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;
        const receivingUser = room.user1.socket.id !== senderSocketID ? room.user1 : room.user2;
        receivingUser.socket.emit("offer", { sdp: sdp, roomId: roomId, username: username });
    }

    onAnswer(roomId: string, sdp: string, senderSocketID: string, username: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;
        const receivingUser = room.user1.socket.id !== senderSocketID ? room.user1 : room.user2;
        receivingUser.socket.emit("answer", { sdp: sdp, roomId: roomId, username: username });
    }

    generate() {
        return ROOM_ID++;
    }
}
