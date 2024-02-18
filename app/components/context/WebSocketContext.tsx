"use client";
import { StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
// WebSocketContext.tsx
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	closeWebSocket,
	connectWebSocket,
	sendWebSocketMessage,
} from "../../api/websocket";

interface StreamDataType {
	[key: string]: StreamData; // Use StreamData directly for each key
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

interface WebSocketProviderProps {
	children: ReactNode;
}

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