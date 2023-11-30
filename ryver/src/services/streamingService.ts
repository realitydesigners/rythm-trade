import { ServerWebSocket } from "bun";
import { OandaApi } from "./OandaApi";

export class StreamingService {
  private oandaApi: OandaApi;
  private clients: Set<ServerWebSocket>;

  constructor() {
    this.oandaApi = new OandaApi(
      process.env.OANDA_TOKEN as string,
      process.env.OANDA_BASE_URL as string,
      process.env.ACCOUNT_ID as string,
      process.env.OANDA_STREAM_URL as string
    );
    this.clients = new Set();
  }

  public addClient(ws: ServerWebSocket) {
    this.clients.add(ws);
  }

  public removeClient(ws: ServerWebSocket) {
    this.clients.delete(ws);
  }

  public startStreaming(pairs: string[]) {
    this.oandaApi.subscribeToPairs(pairs, (data, pair) => {
      this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ pair, data }));
        }
      });
    });
  }
}
