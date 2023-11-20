import { BoxArrays } from '@/types';
import { OandaApi } from '../api/OandaApi';
// import { AlgorithmTools, initTools } from './path/to/AlgorithmTools';
// import { Indicators } from './path/to/Indicators';
// import { Ticky } from './path/to/Ticky';

class ResoBot { 
  private symbol: string; 
  apiContext: OandaApi;

  constructor(
     symbol = 'EUR_USD', 
     apiContext: OandaApi,
  ) { 
     this.symbol = symbol; 
     this.apiContext = apiContext;
  }

  onData(currentPrice: number, boxArrays: BoxArrays) {
    console.log('current Price: ' + currentPrice)
    console.log('boxArrays: ' + boxArrays)
    if (this.shouldBuy(currentPrice, boxArrays)) {
      // Buy logic
    } else if (this.shouldSell(currentPrice, boxArrays)) {
      // Sell logic
    }
  }

  shouldBuy(currentPrice: number, boxArrays: BoxArrays) {
    // Implement your buy logic here
    return false; // Placeholder return
  }

  shouldSell(currentPrice: number, boxArrays: BoxArrays) {
    // Implement your sell logic here
    return false; // Placeholder return
  }
}

export default ResoBot;
