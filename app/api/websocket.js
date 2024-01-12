let websocket = null;
const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export const connectWebSocket = (userId, onMessage, onError, onClose) => {
	if (websocket && websocket.readyState === WebSocket.OPEN) {
		websocket.close();
	}

	websocket = new WebSocket(websocketUrl);

	websocket.onopen = () => {
		console.log("WebSocket Connected With Bun");
		sendWebSocketMessage({ userId });
	};

	websocket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		onMessage(data);
	};

	websocket.onerror = (event) => {
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

export const sendWebSocketMessage = (message) => {
	if (websocket && websocket.readyState === WebSocket.OPEN) {
		websocket.send(JSON.stringify(message));
	}
};

// Server-side code using Bun
export const startWebSocketServer = () => {
	Bun.serve({
		fetch(req, server) {
			if (req.headers.get("Upgrade") === "websocket") {
				server.upgrade(req);
				return;
			}
			return new Response("Not a WebSocket request", { status: 400 });
		},
		websocket: {
			open(ws) {
				console.log("WebSocket Connected with Bun");
				ws.send(JSON.stringify({ message: "Connection established" }));
			},
			message(ws, message) {
				console.log("Message received:", message);
				ws.send(message); // Echo back the message
			},
			close(ws) {
				console.log("WebSocket Disconnected");
			},
		},
	});
};

if (typeof Bun !== "undefined") {
	startWebSocketServer();
}
