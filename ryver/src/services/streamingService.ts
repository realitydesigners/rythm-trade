import { OandaApi } from './OandaApi';

export class StreamingService {
  private oandaApi: OandaApi;

  constructor() {
    this.oandaApi = new OandaApi(
      process.env.OANDA_TOKEN as string,
      process.env.OANDA_BASE_URL as string,
      process.env.ACCOUNT_ID as string,
      process.env.OANDA_STREAM_URL as string
    );
  }

  public startStreaming(pairs: string[]) {
    this.oandaApi.subscribeToPairs(pairs, (data, pair) => {
      // Handle streaming data here
      console.log(`Data for ${pair}:`, data);
    });
  }
}
