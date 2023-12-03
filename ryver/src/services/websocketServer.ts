// src/services/WebSocketServer.ts

import { Server, ServerWebSocket } from 'bun';
import { StreamingService } from './streamingService';

export class WebSocketServer {
  private streamingService: StreamingService;

  constructor() {
    this.streamingService = new StreamingService();
  }
  
  public start() {
    console.log('Starting WebSocket Server on port 8081...');
    Bun.serve({
      port: 8081,
      fetch: (req, server) => {
        console.log(`Incoming request on ${req.url}`);
        if (server.upgrade(req)) {
          console.log('WebSocket upgrade successful');
          return;
        }
        console.log('Request not for WebSocket, sending 404');
        return new Response('Not Found', { status: 404 });
      },
      websocket: {
        open: (ws: ServerWebSocket<any>) => {
          console.log('WebSocket connection opened');
          // Expect the client to send user ID in the first message
        },
        close: (ws: ServerWebSocket<any>) => {
          console.log('WebSocket connection closed');
          // Implement logic to handle WebSocket closure
        },
        message: (ws, message) => {
          console.log('Message received:', message);

          // Ensure message is a string before parsing
          const messageString = message instanceof Buffer ? message.toString() : message;
          try {
            const { userId } = JSON.parse(messageString);
            if (userId) {
              this.streamingService.addClient(userId, ws);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        },
      },
    });
  }
}

