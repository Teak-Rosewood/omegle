import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextProps {
    children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);
const URL = "http://localhost:3000";

export const useSocket = (): Socket | null => useContext(SocketContext);

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Create the socket connection when the app mounts
        const newSocket = io(URL, { autoConnect: false });

        setSocket(newSocket);
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
