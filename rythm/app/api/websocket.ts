let websocket: WebSocket | null = null;
const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL as string;

export const connectWebSocket = (
	userId: string,
	onMessage: (data: any) => void,
	onError: (event: Event) => void,
	onClose: () => void,
) => {
	if (websocket && websocket.readyState === WebSocket.OPEN) {
		websocket.close();
	}

	websocket = new WebSocket(websocketUrl);

	websocket.onopen = () => {
		console.log("WebSocket Connected With Bun");
		sendWebSocketMessage({ userId });
	};

	websocket.onmessage = (event: MessageEvent) => {
		const data = JSON.parse(event.data);
		onMessage(data);
	};

	websocket.onerror = (event: Event) => {
		console.error("WebSocket Error:", event);
		onError(event);
	};

	websocket.onclose = () => {
		console.log("WebSocket Disconnected");
		onClose();
	};
};

export const closeWebSocket = () => {
	if (websocket && websocket.readyState === WebSocket.OPEN) {
		websocket.close();
	}
};

export const sendWebSocketMessage = (message: object) => {
	if (websocket && websocket.readyState === WebSocket.OPEN) {
		websocket.send(JSON.stringify(message));
	}
};

// Server-side code using Bun
export const startWebSocketServer = () => {
	if (typeof Bun === "undefined") {
		return;
	}

	Bun.serve({
		fetch(req: Request, server: any) {
			if (req.headers.get("Upgrade") === "websocket") {
				server.upgrade(req);
				return;
			}
			return new Response("Not a WebSocket request", { status: 400 });
		},
		websocket: {
			open(ws: any) {
				console.log("WebSocket Connected with Bun");
				ws.send(JSON.stringify({ message: "Connection established" }));
			},
			message(ws: any, message: string) {
				console.log("Message received:", message);
				ws.send(message); // Echo back the message
			},
			close(ws: any) {
				console.log("WebSocket Disconnected");
			},
		},
	});
};

// Usage
if (typeof Bun !== "undefined") {
	startWebSocketServer();
}
