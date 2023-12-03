import { OandaApi } from '../../services/OandaApi';
import { DatabaseService } from '../../services/DatabaseService';

export class OandaController {
  private oandaApi: OandaApi;
  private dbService: DatabaseService;

  constructor() {
    this.oandaApi = new OandaApi(process.env.OANDA_TOKEN as string, process.env.OANDA_BASE_URL as string, process.env.ACCOUNT_ID as string, process.env.OANDA_STREAM_URL as string);
    this.dbService = new DatabaseService();
  }

  /**
   * Retrieves the account summary from the Oanda API.
   * @param {string} userId - The ID of the user for whom the account summary is being fetched.
   * @returns {Promise<any>} A promise that resolves to the account summary.
   */
  public async getAccountSummary(userId: string): Promise<any> {
    console.log('Received request for getAccountSummary');
    try {
      // Check if user exists
      const userData = await this.dbService.getUserByClerkId(userId);
      if (!userData) {
        console.error(`User not found for ID: ${userId}`);
        return { error: 'User not found' };
      }
      const summary = await this.oandaApi.getAccountSummary();
      console.log('Account Summary:', summary);
      return summary;
    } catch (error) {
      console.error('Error in getAccountSummary:', error);
      return { error: 'An error occurred while fetching account summary' };
    }
  }

  /**
   * Retrieves the list of instruments from the Oanda API for a user's account.
   * @param {string} userId - The ID of the user for whom the instruments are being fetched.
   * @returns {Promise<any>} A promise that resolves to the list of instruments.
   */
  public async getInstruments(userId: string): Promise<any> {
    console.log(`Received request for getInstruments for user: ${userId}`);
    try {
      // Check if user exists
      const userData = await this.dbService.getUserByClerkId(userId);
      if (!userData) {
        console.error(`User not found for ID: ${userId}`);
        return { error: 'User not found' };
      }

      // Fetch instruments for the user's account
      const instruments = await this.oandaApi.getAccountInstruments();
      console.log('Instruments:', instruments);
      return instruments;
    } catch (error) {
      console.error('Error in getInstruments:', error);
      return { error: 'An error occurred while fetching instruments' };
    }
  }

  /**
   * Retrieves all positions from the Oanda API for a user's account.
   * @param {string} userId - The ID of the user for whom the positions are being fetched.
   * @returns {Promise<any>} A promise that resolves to the list of all positions.
   */
  public async getAllPositions(userId: string): Promise<any> {
    try {
      // Check if user exists
      const userData = await this.dbService.getUserByClerkId(userId);
      if (!userData) {
        console.error(`User not found for ID: ${userId}`);
        return { error: 'User not found' };
      }

      // Fetch all positions for the user's account
      const positions = await this.oandaApi.getAllPositions();
      return positions;
    } catch (error) {
      console.error('Error in getAllPositions:', error);
      return { error: 'An error occurred while fetching positions' };
    }
  }
}
