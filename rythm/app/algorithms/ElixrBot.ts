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
        // Check if conditions are met to close the trade
        if (this.unrealizedPL !== null && (this.unrealizedPL > profitTarget || this.unrealizedPL < -profitTarget)) {
          if (this.isLongPosition && this.unitsLong !== null) {
            console.log('close long now');
            this.apiContext.closePosition(this.symbol, this.unitsLong).then(result => {
              console.log('Long position closed:', result);
              this.tradeCount = 0;
              this.isLongPosition = false;
              this.isShortPosition = false;
            });
          } else if (this.isShortPosition && this.unitsShort !== null) {
            console.log('close short now');
            this.apiContext.closePosition(this.symbol, this.unitsShort).then(result => {
              console.log('Short position closed:', result);
              this.tradeCount = 0;
              this.isLongPosition = false;
              this.isShortPosition = false;
            });
          }
        }
      }
      // Execute trade if no current trade is open
      if (this.tradeCount === 0) {
        if (this.shouldSell(currentPrice, priceToElixrRatio, intersectingPrice)) {
          this.apiContext.placeTrade(this.symbol, tradeSize, -1).then(tradeId => {
            console.log('Trade placed:', tradeId);
          });
          this.tradeCount += 1;
          this.isShortPosition = true;
          this.isLongPosition = false;
        } else if (this.shouldBuy(currentPrice, priceToElixrRatio, intersectingPrice)) {
          this.apiContext.placeTrade(this.symbol, tradeSize, 1).then(tradeId => {
            console.log('Trade placed:', tradeId);
          });
          this.tradeCount += 1;
          this.isLongPosition = true;
          this.isShortPosition = false;
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
