import { DatabaseService } from './DatabaseService';
import { ServerWebSocket } from "bun";
import { OandaApi } from './OandaApi';

export class StreamingService {
  private oandaApi: OandaApi;
  private clients: Map<string, ServerWebSocket>;
  private dbService: DatabaseService;
  private activeStreams: Set<string>; // Define activeStreams as a Set of strings

  constructor() {
    this.oandaApi = new OandaApi(
      process.env.OANDA_TOKEN as string,
      process.env.OANDA_BASE_URL as string,
      process.env.ACCOUNT_ID as string,
      process.env.OANDA_STREAM_URL as string
    );
    this.dbService = new DatabaseService();
    this.clients = new Map();
    this.activeStreams = new Set(); // Initialize activeStreams
  }

  private async updateStreamingPairs(userId: string) {
    
    const forexPreferences = await this.dbService.getForexPreferences(userId);
    if (!forexPreferences) return;
  
    const newPairs = forexPreferences.pairs.map((p: { pair: any; }) => p.pair);
    const currentPairs = Array.from(this.activeStreams);
  
    // Unsubscribe from pairs no longer in preferences
    const pairsToUnsubscribe = currentPairs.filter(p => !newPairs.includes(p));
    this.oandaApi.unsubscribeFromPairs(pairsToUnsubscribe);
  
    // Subscribe to new pairs in preferences
    const pairsToSubscribe = newPairs.filter((p: string) => !this.activeStreams.has(p));
    if (pairsToSubscribe.length > 0) {
      this.startStreaming(pairsToSubscribe);
    }
  }
  public async handleFavoritePairsUpdate(userId: string, updatedFavoritePairs: string[]) {
    // Update the user's favorite pairs in the database
    await this.dbService.setForexPreferences(userId, updatedFavoritePairs);
  
    // Update streaming pairs based on new preferences
    await this.updateStreamingPairs(userId);
  }
  

  public async addClient(userId: string, ws: ServerWebSocket) {
    this.clients.set(userId, ws);
    await this.updateStreamingPairs(userId);
  }

  public removeClient(userId: string) {
    this.clients.delete(userId);
  }

  private startStreaming(pairs: string[]) {
    this.oandaApi.subscribeToPairs(pairs, (data, pair) => {
      pairs.forEach(p => this.activeStreams.add(p)); // Update activeStreams
      this.clients.forEach((client, userId) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ pair, data }));
        }
      });
    });
  }
}
