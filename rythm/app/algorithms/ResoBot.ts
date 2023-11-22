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
  private positionSummary: any = null;
  private isProcessingTrade: boolean = false;
  private isActive: boolean = false;

  constructor(symbol: string, apiContext: OandaApi) {
    this.symbol = symbol;
    this.apiContext = apiContext;
  }

  toggleActive() {
    this.isActive = !this.isActive;
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
        this.marginCloseoutPercent = parseFloat(this.accountSummary.marginCloseoutPercent);
      }

      if (this.pairPositionSummary) {
        const longUnits = parseInt(this.pairPositionSummary.long?.units ?? '0');
        const shortUnits = parseInt(this.pairPositionSummary.short?.units ?? '0');
        const positionCount = longUnits !== 0 || shortUnits !== 0 ? 1 : 0;
        const longTradeCount = this.pairPositionSummary.long?.tradeIDs?.length ?? 0;
        const shortTradeCount = this.pairPositionSummary.short?.tradeIDs?.length ?? 0;
        const tradeCount = longTradeCount + shortTradeCount;

        this.positionSummary = {
          lastTransactionID: this.pairPositionSummary?.lastTransactionID ?? '',
          instrument: this.symbol,
          long: this.pairPositionSummary?.long ?? {},
          short: this.pairPositionSummary?.short ?? {},
          pl: this.accountSummary?.pl ?? 0,
          unrealizedPL: this.accountSummary?.unrealizedPL ?? 0,
          positionCount: positionCount,
          tradeCount: tradeCount,
        };
      }
      console.log(`Fetched data for ${this.symbol}:`, {
        unrealizedPL: this.unrealizedPL,
        realizedPL: this.realizedPL,
        equity: this.equity,
        tradeCount: this.tradeCount,
        positionSummary: this.positionSummary,
      });
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
