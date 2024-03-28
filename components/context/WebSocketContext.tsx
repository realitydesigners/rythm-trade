"use client";
import { closeWebSocket, connectWebSocket } from "@/app/api/websocket";
import { StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

interface StreamDataType {
    [key: string]: StreamData;
}

interface WebSocketContextType {
    streamData: StreamDataType;
}

interface WebSocketProviderProps {
    children: ReactNode;
}
const WebSocketContext = createContext<WebSocketContextType>({
    streamData: {},
});

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children,
}) => {
    const { user } = useUser();
    const [streamData, setStreamData] = useState<StreamDataType>({});

    useEffect(() => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const handleWebSocketMessage = (message: any) => {
            const { data, pair } = message;
            if (data.type !== "HEARTBEAT") {
                setStreamData((prevData) => ({
                    ...prevData,
                    [pair]: data,
                }));
            }
        };

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const handleWebSocketError = (event: any) => {
            console.error("WebSocket Error:", event);
        };

        const handleWebSocketClose = () => {
            console.log("WebSocket Disconnecteds");
        };

        if (user) {
            connectWebSocket(
                user.id,
                handleWebSocketMessage,
                handleWebSocketError,
                handleWebSocketClose,
            );
        }

        return () => {
            closeWebSocket();
        };
    }, [user]);

    return (
        <WebSocketContext.Provider value={{ streamData }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
