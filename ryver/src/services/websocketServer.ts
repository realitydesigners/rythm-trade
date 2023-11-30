import { Server, ServerWebSocket } from 'bun';
import { StreamingService } from './streamingService';

export class WebSocketServer {

  private streamingService: StreamingService;

  constructor() {
    this.streamingService = new StreamingService();
    this.streamingService.startStreaming(['EUR/USD', 'GBP/USD']);
  }
  
  public start() {
    console.log('Starting WebSocket Server on port 8081...');
    Bun.serve({
      port: 8081,
      fetch: (req, server) => {
        console.log(`Incoming request on ${req.url}`);
        console.log('Headers:', req.headers);
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
          this.streamingService.addClient(ws);
        },
        close: (ws: ServerWebSocket<any>) => {
          console.log('WebSocket connection closed');
          this.streamingService.removeClient(ws);
        },
        message: (ws, message) => {
          console.log('Message received:', message);
        },
      },
    });
  }
}
