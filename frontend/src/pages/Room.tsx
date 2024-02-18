import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
const URL = "http://localhost:3001";

const Room = () => {
    const [lobby, setLobby] = useState(false);
    const [receiver, setReceiver] = useState("");
    const { name } = useParams();
    useEffect(() => {
        const socket = io(URL);
        socket.connect();

        socket.on("lobby", () => {
            setLobby(true);
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
            console.log("connection completed");
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    if (lobby === true) {
        return (
            <>
                <div>{name} is currently waiting in the lobby</div>
            </>
        );
    }
    return (
        <>
            <div>
                You are {name} and connected with {receiver}
            </div>
        </>
    );
};

export default Room;
