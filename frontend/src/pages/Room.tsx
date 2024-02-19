import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
const URL = "http://localhost:3000";

interface messageProp {
    username: string;
    message: string;
}
const Room = () => {
    const { name } = useParams();

    const [lobby, setLobby] = useState(true);
    const [receiver, setReceiver] = useState();
    const [socket, setSocket] = useState<null | Socket>(null);
    const [roomID, setRoomID] = useState("");

    // const [sendingPc, setSendingPc] = useState<RTCPeerConnection | null>(null);
    // const [receivingPc, setReveivingPc] = useState<RTCPeerConnection | null>(null);

    // const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
    // // const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    // const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    // const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);

    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState<messageProp[]>([]);

    // const remoteVideoRef = useRef<HTMLVideoElement>();
    const localVideoRef = useRef<HTMLVideoElement>(null);

    const sendMessage = () => {
        if (!socket || !name) return;
        setMessage("");
        setConversation((prevValue) => [...prevValue, { username: name, message: message }]);
        socket.emit("send-message", { roomId: roomID, message: message });
    };

    const switchUser = useCallback((socket: Socket | null) => {
        if (socket === null) return;
        setLobby(true);
        setConversation([]);
        socket.disconnect();
        socket.connect();
    }, []);

    const getCameraSettings = useCallback(async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        const video = stream.getVideoTracks()[0];
        // const audio = stream.getAudioTracks()[0];

        // setLocalAudioTrack(audio);
        // setLocalVideoTrack(video);

        if (!localVideoRef.current) return;
        localVideoRef.current.srcObject = new MediaStream([video]);
        localVideoRef.current.play();
    }, []);

    useEffect(() => {
        let receiving_user = "";
        getCameraSettings();
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
            // const pc = new RTCPeerConnection();
            // if (localAudioTrack && localVideoTrack) {
            //     pc.addTrack(localAudioTrack);
            //     pc.addTrack(localVideoTrack);
            // }
            // const sdp = await pc.createOffer();
            setRoomID(roomId);
            socket.emit("offer", { sdp: "", roomId: roomId, username: name });
        });

        socket.on("offer", ({ sdp, roomId, username }) => {
            // const pc = new RTCPeerConnection();
            // pc.setRemoteDescription({ sdp: sdp, type: "offer" });
            // const sender_sdp = await pc.createAnswer();
            setReceiver(username);
            receiving_user = username;
            setRoomID(roomId);
            setLobby(false);
            socket.emit("answer", { sdp: "", room_id: roomId, username: name });
        });

        socket.on("answer", ({ sdp, roomId, username }) => {
            setReceiver(username);
            receiving_user = username;
            setLobby(false);
        });

        socket.on("new-message", ({ message }) => {
            // console.log(receiver);
            if (!receiver) return;
            setConversation((prevValue) => [...prevValue, { username: receiving_user, message: message }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [receiver]);

    if (lobby === true) {
        return (
            <>
                <video autoPlay height={400} width={400} ref={localVideoRef} />
                <div>You are currently waiting in the lobby...</div>
            </>
        );
    }
    return (
        <>
            <div className="flex flex-row items-end">
                <div className="flex-1 border-2 border-gray-500 p-1">
                    <div className="flex flex-col">
                        <video autoPlay height={600} width={600} ref={localVideoRef} />
                        <video autoPlay height={600} width={600} ref={localVideoRef} />
                    </div>
                </div>
                <div className="flex-1 p-1 ">
                    <div>
                        {conversation.map((value, index) => {
                            if (value.username === name)
                                return (
                                    <>
                                        <div className="flex flex-row-reverse" key={index.toString()}>
                                            <div key={index.toString() + "-username"} className="text-blue-500">
                                                :{value.username}
                                            </div>
                                            <div key={index.toString() + "-message"}>{value.message}</div>
                                        </div>
                                    </>
                                );
                            return (
                                <>
                                    <div className="flex flex-row" key={index.toString()}>
                                        <div key={index.toString() + "-username"} className="text-red-500">
                                            {value.username}:
                                        </div>
                                        <div key={index.toString() + "-message"}>{value.message}</div>
                                    </div>
                                </>
                            );
                        })}
                        you are talking to {receiver}
                    </div>
                    <div className="flex flex-row relative inset-x-0 bottom-0">
                        <input
                            className="basis-3/4"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                            value={message}
                            type="text"
                            defaultValue=""
                            placeholder="enter message... "
                            onChange={(event) => setMessage(event.target.value)}
                        />
                        <button className="basis-1/4" onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>

            <button onClick={() => switchUser(socket)}>Find Someone Else</button>
        </>
    );
};

export default Room;
