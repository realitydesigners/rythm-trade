import { DatabaseService } from './DatabaseService';
import { ServerWebSocket } from "bun";
import { OandaApi } from './OandaApi';

export class StreamingService {
  private oandaApi: OandaApi;
  private clients: Map<string, ServerWebSocket>;
  private dbService: DatabaseService;

  constructor() {
    this.oandaApi = new OandaApi(
      process.env.OANDA_TOKEN as string,
      process.env.OANDA_BASE_URL as string,
      process.env.ACCOUNT_ID as string,
      process.env.OANDA_STREAM_URL as string
    );
    this.dbService = new DatabaseService();
    this.clients = new Map();
  }

  public async addClient(userId: string, ws: ServerWebSocket) {
    this.clients.set(userId, ws);

    // Fetch user preferences and start streaming
    const forexPreferences = await this.dbService.getForexPreferences(userId);
    if (forexPreferences) {
      const pairs = forexPreferences.pairs.map((pair: { pair: any; }) => pair.pair);
      this.startStreaming(pairs);
    }
  }

  public removeClient(userId: string) {
    this.clients.delete(userId);
  }

  private startStreaming(pairs: string[]) {
    this.oandaApi.subscribeToPairs(pairs, (data, pair) => {
      this.clients.forEach((client, userId) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ pair, data }));
        }
      });
    });
  }
}
