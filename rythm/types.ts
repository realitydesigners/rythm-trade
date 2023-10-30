export interface CandleData {
    time: string;
    mid: {
      o: string;
      c: string;
      h: string;
      l: string;
    };
   
  }
  
  export interface StreamData {
    type: string;
    time: string; 
    symbol: string;
    price: number;
  }
  
  export interface Price {
    bid: string | null;
    ask: string | null;
  }
  
  export interface ForexData {
    GBP_USD?: Price;
    USD_JPY?: Price;
  }
  