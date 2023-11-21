import { OandaApi } from '../api/OandaApi';

class ElixrBot {
  private symbol: string;
  private apiContext: OandaApi;
  private dataFetchIntervalId: NodeJS.Timeout | null = null;

  private unrealizedPL: number | null = null;
  private realizedPL: number | null = null;
  private equity: number | null = null;
  private tradeCount: number | null = null;
  private marginCloseoutPercent: number | null = null;
  private unitsLong: number | null = null;
  private unitsShort: number | null = null;
  private accountSummary: any = null;
  private pairPositionSummary: any = null;

  constructor(symbol = 'EUR_USD', apiContext: OandaApi) {
    this.symbol = symbol;
    this.apiContext = apiContext;
  }

  public async startDataCollection(interval: number = 60000) {
    this.stopDataCollection();

    await this.fetchData();

    this.dataFetchIntervalId = setInterval(() => this.fetchData(), interval);
  }

  private async fetchData() {
    try {
      this.pairPositionSummary = await this.apiContext.getPairPositionSummary(this.symbol);
      this.accountSummary = await this.apiContext.getAccountSummary();

      if (this.accountSummary) {
        this.unrealizedPL = parseFloat(this.accountSummary.unrealizedPL);
        this.realizedPL = parseFloat(this.accountSummary.pl);
        this.equity = parseFloat(this.accountSummary.NAV);
        this.tradeCount = parseInt(this.accountSummary.openTradeCount);
        this.marginCloseoutPercent = parseFloat(this.accountSummary.marginCloseoutPercent);
      }

      if (this.pairPositionSummary) {
        this.unitsLong = parseInt(this.pairPositionSummary.long.units);
        this.unitsShort = parseInt(this.pairPositionSummary.short.units);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }


  public stopDataCollection() {
    if (this.dataFetchIntervalId) {
      clearInterval(this.dataFetchIntervalId);
      this.dataFetchIntervalId = null;
    }
  }
   onData(currentPrice: number, priceToElixrRatio: number, intersectingPrice: number) {
      console.log(this.unitsLong)
      console.log(this.unitsShort)
    }
    shouldBuy(currentPrice: { currentPrice: number; candleData: any; }, priceToElixrRatio: undefined, intersectingPrice: undefined) {
      return false;
    }
  
    shouldSell(currentPrice: { currentPrice: number; candleData: any; }, priceToElixrRatio: undefined, intersectingPrice: undefined) {
      return false;
    }
  }

export default ElixrBot;
