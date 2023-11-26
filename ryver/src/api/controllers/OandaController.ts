import { OandaApi } from "../../services/OandaApi";

export class OandaController {
  private oandaApi: OandaApi;

  constructor() {
    this.oandaApi = new OandaApi(
      process.env.OANDA_TOKEN as string,
      process.env.OANDA_BASE_URL as string,
      process.env.ACCOUNT_ID as string,
      process.env.OANDA_STREAM_URL as string
    );
  }

  public async getAccountSummary() {
    console.log("Received request for getAccountSummary");
    try {
      const summary = await this.oandaApi.getAccountSummary();
      console.log("Account Summary:", summary);
      return summary; // Directly return the summary
    } catch (error) {
      console.error("Error in getAccountSummary:", error);
      return { error: 'An error occurred while fetching account summary' }; // Return error response
    }
  }
}
