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
  private isLongPosition: boolean = false;
  private isShortPosition: boolean = false;

  private isActive: boolean = false;
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
  onData(currentPrice: number, priceToElixrRatio: number, intersectingPrice: number) {
    if (!this.isActive) {
      console.log('Bot is not active.');
      return;
    }

    console.log(`Current Price: ${currentPrice}, Price to Elixr Ratio: ${priceToElixrRatio}, Intersecting Price: ${intersectingPrice}`);
    console.log(`Long Position: ${this.isLongPosition}, Short Position: ${this.isShortPosition}`);

    if (this.equity !== null && this.tradeCount !== null) {
      console.log(`Unrealized PL: ${this.unrealizedPL}, Profit Target: ${this.equity * 0.001}`);
      console.log('short units: ' + this.unitsShort);
      console.log('long units: ' + this.unitsLong);
      const profitTarget = this.equity * 0.001;
      const tradeSize = this.equity * 3;

      if (this.tradeCount > 0) {
        const closeAndFetchData = async (isLong: boolean, units: number) => {
          const closeResult = await this.apiContext.closePosition(this.symbol, units);
          console.log(isLong ? 'Long position closed:' : 'Short position closed:', closeResult);
          this.tradeCount = 0;
          this.isLongPosition = false;
          this.isShortPosition = false;
          await this.fetchData();
        };

        if (this.unrealizedPL !== null && (this.unrealizedPL > profitTarget || this.unrealizedPL < -profitTarget)) {
          if (this.isLongPosition && this.unitsLong !== null) {
            console.log('close long now');
            closeAndFetchData(true, this.unitsLong);
          } else if (this.isShortPosition && this.unitsShort !== null) {
            console.log('close short now');
            closeAndFetchData(false, this.unitsShort);
          }
        }
      }
      const placeTradeAndUpdate = async (size: number, direction: number) => {
        await this.apiContext.placeTrade(this.symbol, size, direction);
        console.log(`Trade placed: ${size} units, direction: ${direction}`);
        await this.fetchData();
      };

      if (this.tradeCount === 0) {
        if (this.shouldSell(currentPrice, priceToElixrRatio, intersectingPrice)) {
          placeTradeAndUpdate(tradeSize, -1);
          this.isShortPosition = true;
          this.isLongPosition = false;
          this.tradeCount = 1;
        } else if (this.shouldBuy(currentPrice, priceToElixrRatio, intersectingPrice)) {
          placeTradeAndUpdate(tradeSize, 1);
          this.isLongPosition = true;
          this.isShortPosition = false;
          this.tradeCount = 1;
        }
      }
    }
  }

  shouldBuy(currentPrice: number, priceToElixrRatio: number, intersectingPrice: number): boolean {
    return (priceToElixrRatio === 0.0 || currentPrice < intersectingPrice) && !this.isLongPosition;
  }

  shouldSell(currentPrice: number, priceToElixrRatio: number, intersectingPrice: number): boolean {
    return (priceToElixrRatio === 1.0 || currentPrice > intersectingPrice) && !this.isShortPosition;
  }
}

export default ElixrBot;
