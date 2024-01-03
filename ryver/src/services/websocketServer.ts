import { Server, ServerWebSocket } from "bun";
import { StreamingService } from "./streamingService";

export class WebSocketServer {
	private streamingService: StreamingService;

	constructor() {
		this.streamingService = new StreamingService();
	}

	public start() {
		const port = parseInt(process.env.PORT || "8081", 10);
		console.log(`Starting WebSocket Server on port ${port}...`);

		Bun.serve({
			port: port,
			fetch: (req, server) => {
				console.log(`Incoming request on ${req.url}`);
				if (server.upgrade(req)) {
					console.log("WebSocket upgrade successful");
					return;
				}
				console.log("Request not for WebSocket, sending 404");
				return new Response("Not Found", { status: 404 });
			},
			websocket: {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				open: (ws: ServerWebSocket<any>) => {
					console.log("WebSocket connection opened");
				},
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				close: (ws: ServerWebSocket<any>) => {
					console.log("WebSocket connection closed");
				},
				message: (ws, message) => {
					console.log("Message received:", message);

					const messageString =
						message instanceof Buffer ? message.toString() : message;
					try {
						const parsedMessage = JSON.parse(messageString);

						if (parsedMessage.userId) {
							this.streamingService.addClient(parsedMessage.userId, ws);
						}

						if (parsedMessage.userId && parsedMessage.favoritePairs) {
							this.streamingService.handleFavoritePairsUpdate(
								parsedMessage.userId,
								parsedMessage.favoritePairs,
							);
						}
					} catch (error) {
						console.error("Error parsing message:", error);
					}
				},
			},
		});
	}
}
