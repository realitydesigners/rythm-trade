import { BoxArrays } from '@/types';
import { OandaApi } from '../api/OandaApi';

class ResoBot {
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
  private isLongPosition: boolean = false;
  private isShortPosition: boolean = false;

  private isActive: boolean = false;
  // Method to toggle the bot's active state
  toggleActive() {
    this.isActive = !this.isActive;
  }

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
        this.isLongPosition = this.unitsLong > 0;
        this.isShortPosition = this.unitsShort < 0;
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  public stopDataCollection() {
    if (this.dataFetchIntervalId) {
      clearInterval(this.dataFetchIntervalId);
      this.dataFetchIntervalId = null;
    }
  }
  onData(currentPrice: number, boxArrays: BoxArrays) {
    if (this.shouldBuy(currentPrice, boxArrays)) {
    } else if (this.shouldSell(currentPrice, boxArrays)) {
    }
  }

  shouldBuy(currentPrice: number, boxArrays: BoxArrays) {
    return false;
  }

  shouldSell(currentPrice: number, boxArrays: BoxArrays) {
    return false;
  }
}

export default ResoBot;
