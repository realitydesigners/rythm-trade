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

interface PriceDetail {
  price: string;
}

export interface StreamData {
  bids?: PriceDetail[];
  asks?: PriceDetail[];
}

export interface Price {
  value: any;
  bid: string | null;
  ask: string | null;
}

export interface ForexData {
  [key: string]: Price | undefined;

  GBP_USD?: Price;
  USD_JPY?: Price;
  // Add more properties for other currency pairs if needed
}

export interface Box {
  high: number;
  low: number;
  boxMovedUp: boolean;
  boxMovedDn: boolean;
  rngSize: number;
}

// Updated BoxArrays interface to hold a single Box per key
export interface BoxArrays {
  [key: number]: Box;
}