import { OandaApi } from '../api/OandaApi';
// import { AlgorithmTools, initTools } from './path/to/AlgorithmTools';
// import { Indicators } from './path/to/Indicators';
// import { Ticky } from './path/to/Ticky';

class ElixrBot { 
  private symbol: string; 
  apiContext: OandaApi;

  constructor(
     symbol = 'EUR_USD', 
     apiContext: OandaApi,
  ) { 
     this.symbol = symbol; 
     this.apiContext = apiContext;
  }

   onData(currentPrice: number, priceToElixrRatio: number, intersectingPrice: number) {
      // Decide to buy or sell based on the strategy
      // console.log("currentPrice: " + currentPrice)
      // console.log("priceToElixrRatio: " + priceToElixrRatio)
      // console.log("intersectingPrice: " + intersectingPrice)
      // console.log(this.apiContext)
      // console.log(this.symbol)
      // if (this.shouldBuy(currentPrice, priceToElixrRatio, intersectingPrice)) {
      //   this.apiContext.buy(this.symbol /*, other parameters as needed */);
      // } else if (this.shouldSell(currentPrice, priceToElixrRatio, intersectingPrice)) {
      //   this.apiContext.sell(this.symbol /*, other parameters as needed */);
      // }
    }
    shouldBuy(currentPrice: { currentPrice: number; candleData: any; }, priceToElixrRatio: undefined, intersectingPrice: undefined) {
      // Implement your buy logic here
      return false; // Placeholder return
    }
  
    shouldSell(currentPrice: { currentPrice: number; candleData: any; }, priceToElixrRatio: undefined, intersectingPrice: undefined) {
      // Implement your sell logic here
      return false; // Placeholder return
    }
  }

export default ElixrBot;
