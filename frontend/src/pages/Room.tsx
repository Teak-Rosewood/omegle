import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
const URL = "http://localhost:3001";

const Room = () => {
    const [lobby, setLobby] = useState(true);
    const [receiver, setReceiver] = useState("");
    const { name } = useParams();
    const [socket, setSocket] = useState<null | Socket>(null);
    const switchUser = useCallback((socket: Socket | null) => {
        if (socket === null) return;
        setLobby(true);
        socket.disconnect();
        socket.connect();
    }, []);

    useEffect(() => {
        const socket = io(URL, { autoConnect: false });
        setSocket(socket);
        socket.connect();

        socket.on("lobby", (status) => {
            setLobby(status);
        });

        socket.on("switch-user", () => {
            switchUser(socket);
        });

        socket.on("send-offer", ({ roomId }) => {
            socket.emit("offer", { sdp: "", roomId: roomId, username: name });
        });

        socket.on("offer", ({ sdp, roomId, username }) => {
            setReceiver(username);
            setLobby(false);
            socket.emit("answer", { sdp: "", room_id: roomId, username: name });
        });

        socket.on("answer", ({ sdp, roomId, username }) => {
            console.log(username);
            setReceiver(username);
            setLobby(false);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    if (lobby === true) {
        return (
            <>
                <div>You are currently waiting in the lobby...</div>
            </>
        );
    }
    return (
        <>
            <div>
                You are {name} and connected with {receiver}
            </div>
            <button onClick={() => switchUser(socket)}>Find Someone Else</button>
        </>
    );
};

export default Room;
