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
  public async getAccountSummary(ctx: any) {
    console.log("Received request for getAccountSummary");
    try {
      const summary = await this.oandaApi.getAccountSummary();
      console.log("Account Summary:", summary);
      ctx.res.json(summary);
    } catch (error) {
      console.error("Error in getAccountSummary:", error);
      ctx.res.status(500).json({ error: 'An error occurred while fetching account summary' });
    }
  }
}
