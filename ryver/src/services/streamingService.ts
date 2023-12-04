import { DatabaseService } from './DatabaseService';
import { ServerWebSocket } from 'bun';
import { OandaApi } from './OandaApi';

export class StreamingService {
  private clients: Map<string, ServerWebSocket>;
  private dbService: DatabaseService;
  private activeStreams: Set<string>;

  constructor() {
    this.dbService = new DatabaseService();
    this.clients = new Map();
    this.activeStreams = new Set();
  }

  /**
   * Retrieves an instance of the OandaApi for a user based on their credentials.
   * @param {string} userId - The user's ID.
   * @returns {Promise<OandaApi | null>} A promise that resolves to an OandaApi instance or null if credentials are missing.
   */
  private async getOandaApiForUser(userId: string): Promise<OandaApi | null> {
    const user = await this.dbService.getUserByClerkId(userId);
    if (!user || !user.oandaApiKey || !user.oandaAccountId) {
      console.error(`Oanda credentials not found for user ID: ${userId}`);
      return null;
    }
    return new OandaApi(user.oandaApiKey, process.env.OANDA_BASE_URL, user.oandaAccountId, process.env.OANDA_STREAM_URL);
  }

  /**
   * Updates streaming pairs for a user based on their Forex preferences.
   * @param {string} userId - The user's ID.
   */
  private async updateStreamingPairs(userId: string) {
    const forexPreferences = await this.dbService.getForexPreferences(userId);
    if (!forexPreferences) return;

    const oandaApi = await this.getOandaApiForUser(userId);
    if (!oandaApi) return;

    const newPairs = forexPreferences.pairs.map((p: { pair: any }) => p.pair);
    const currentPairs = Array.from(this.activeStreams);

    // Unsubscribe from pairs no longer in preferences
    const pairsToUnsubscribe = currentPairs.filter(p => !newPairs.includes(p));
    await oandaApi.unsubscribeFromPairs(pairsToUnsubscribe);

    // Subscribe to new pairs in preferences
    const pairsToSubscribe = newPairs.filter((p: string) => !this.activeStreams.has(p));
    if (pairsToSubscribe.length > 0) {
      this.startStreaming(userId, pairsToSubscribe, oandaApi);
    }
  }

  /**
   * Handles the update of a user's favorite pairs.
   * @param {string} userId - The user's ID.
   * @param {string[]} updatedFavoritePairs - The updated list of favorite pairs.
   */
  public async handleFavoritePairsUpdate(userId: string, updatedFavoritePairs: string[]) {
    // Update the user's favorite pairs in the database
    await this.dbService.setForexPreferences(userId, updatedFavoritePairs);

    // Update streaming pairs based on new preferences
    await this.updateStreamingPairs(userId);
  }

  /**
   * Adds a client WebSocket connection for a user.
   * @param {string} userId - The user's ID.
   * @param {ServerWebSocket} ws - The WebSocket connection.
   */
  public async addClient(userId: string, ws: ServerWebSocket) {
    this.clients.set(userId, ws);
    await this.updateStreamingPairs(userId);
  }

  /**
   * Removes a client WebSocket connection for a user.
   * @param {string} userId - The user's ID.
   */
  public removeClient(userId: string) {
    this.clients.delete(userId);
  }

  /**
   * Starts streaming data for specified pairs using the Oanda API.
   * @param {string} userId - The user's ID.
   * @param {string[]} pairs - The Forex pairs to stream.
   * @param {OandaApi} oandaApi - An instance of the OandaApi.
   */
  private async startStreaming(userId: string, pairs: string[], oandaApi: OandaApi) {
    oandaApi.subscribeToPairs(pairs, (data, pair) => {
      pairs.forEach(p => this.activeStreams.add(p));
      const client = this.clients.get(userId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ pair, data }));
      }
    });
  }
}
