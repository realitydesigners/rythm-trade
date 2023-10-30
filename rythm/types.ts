export interface CandleData {
  time: string;
  mid: {
    o: string;
    c: string;
    h: string;
    l: string;
  };
  symbol: string; // Add the symbol property to represent the currency pair
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
  GBPUSD?: Price;
  USDJPY?: Price;
  // Add more properties for other currency pairs if needed
}
