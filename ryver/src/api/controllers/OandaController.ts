import { OandaApi } from '../../services/OandaApi';
import { DatabaseService } from '../../services/DatabaseService';

export class OandaController {
  private oandaApi: OandaApi;
  private dbService: DatabaseService;

  constructor() {
    this.oandaApi = new OandaApi(process.env.OANDA_TOKEN as string, process.env.OANDA_BASE_URL as string, process.env.ACCOUNT_ID as string, process.env.OANDA_STREAM_URL as string);
    this.dbService = new DatabaseService();
  }

  public async getAccountSummary(userId: string) {
    console.log('Received request for getAccountSummary');
    try {
      const userData = await this.dbService.getUser(userId);

      const summary = await this.oandaApi.getAccountSummary();
      console.log('Account Summary:', summary);
      return summary;
    } catch (error) {
      console.error('Error in getAccountSummary:', error);
      return { error: 'An error occurred while fetching account summary' };
    }
  }
}
