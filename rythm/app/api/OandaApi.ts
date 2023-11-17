import axios, { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';
import { createContext } from 'react';


const key = process.env.NEXT_PUBLIC_OANDA_TOKEN as string;
const acc_id = process.env.NEXT_PUBLIC_ACCOUNT_ID as string;
const base_url = process.env.NEXT_PUBLIC_OANDA_BASE_URL as string;
const stream_url = process.env.NEXT_PUBLIC_OANDA_STREAM_URL as string;

export class OandaApi {
  private api_key: string;
  private oanda_url: string;
  private account_id: string;
  private stream_link: string;
  private activeStreams: Map<string, ReadableStreamDefaultReader<Uint8Array>> = new Map();

  constructor(api_key: string = key, oanda_url: string = base_url, account_id: string = acc_id, stream_link: string = stream_url) {
    // Initialize Oanda API with optional API key, base URL, and account ID. 

    this.api_key = api_key;
    this.oanda_url = oanda_url;
    this.account_id = account_id;
    this.stream_link = stream_link;

  }

  public async subscribeToPairs(pairs: string[], onData: (data: any, pair: string) => void) {
    for (const pair of pairs) {
      if (!this.activeStreams.has(pair)) {
        try {
          const response = await fetch(`${this.stream_link}/accounts/${this.account_id}/pricing/stream?instruments=${pair}`, {
            headers: {
              Authorization: `Bearer ${this.api_key}`,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch data for pair: ${pair}`);
          }
  
          const reader = response.body?.getReader();
  
          if (reader) {
            this.activeStreams.set(pair, reader);
            this.streamData(pair, reader, onData);
          } else {
            console.error(`Failed to get reader for pair: ${pair}`);
          }
        } catch (error) {
          console.error(`Error while subscribing to pair ${pair}: ${error}`);
        }
      }
    }
  }
  

  public unsubscribeFromPairs(pairs: string[]) {
    for (const pair of pairs) {
      const reader = this.activeStreams.get(pair);
      if (reader) {
        reader.cancel();
        this.activeStreams.delete(pair);
      }
    }
  }
  
  private async streamData(pair: string, reader: ReadableStreamDefaultReader<Uint8Array>, onData: (data: any, pair: string) => void) {
    let buffer = "";
    try {
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        buffer += new TextDecoder().decode(result.value);
  
        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex !== -1) {
          const singleJSON = buffer.slice(0, newlineIndex);
          try {
            const data = JSON.parse(singleJSON);
            onData(data, pair);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
          buffer = buffer.slice(newlineIndex + 1);
          newlineIndex = buffer.indexOf("\n");
        }
      }
    } catch (error) {
      console.error("Error in streamData:", error);
    }
  }
  private async makeRequest(url: string, method: 'get' | 'post' | 'put' = 'get', expectedStatusCode: number = 200, params: any = {}, data: any = {}): Promise<[boolean, any]> {
    // Perform an HTTP request. Returns a tuple [success: boolean, data: any].

    const full_url = `${this.oanda_url}/${url}`;

    const headers = {
      Authorization: `Bearer ${this.api_key}`,
      'Content-Type': 'application/json',
    };

    let response: AxiosResponse;

    try {
      if (method === 'get') {
        response = await axios.get(full_url, { headers, params });
      } else if (method === 'post') {
        response = await axios.post(full_url, data, { headers, params });
      } else if (method === 'put') {
        response = await axios.put(full_url, data, { headers, params });
      } else {
        return [false, { error: 'HTTP verb not supported' }];
      }

      if (response.status === expectedStatusCode) {
        return [true, response.data];
      } else {
        return [false, response.data];
      }
    } catch (error) {
      console.error(`Error in makeRequest: ${error}`);
      return [false, { error }];
    }
  }

  private async getAccountEP(endpoint: string, dataKey: string, accId: string) {
    // Fetch specific endpoint data for a given account ID. Returns the specified data key.

    const url = `accounts/${accId}/${endpoint}`;
    const [ok, data] = await this.makeRequest(url);
    if (ok && data[dataKey]) {
      return data[dataKey];
    } else {
      console.error(`ERROR getAccountEP(${endpoint})`, data);
      return null;
    }
  }

  public async getAccounts(dataKey: string) {
    // Fetch all accounts. Returns data specified by dataKey.

    const url = 'accounts';
    const [ok, data] = await this.makeRequest(url);
    if (ok && data[dataKey]) {
      return data[dataKey];
    } else {
      console.error('ERROR getAccounts()', data);
      return null;
    }
  }
  public async fetchLargeCandles(pairName: string, total_count: number = 6000, granularity: string = 'M1', price: string = 'MBA') {
    const maxChunkSize = 500;
    const minutesPerCandle = 1;

    const toDate = new Date(); 
    const fromDate = new Date(toDate.getTime() - total_count * minutesPerCandle * 60000);

    const allCandles: any[] = [];
    let remaining_count = total_count;
    let currentToDate = new Date(toDate);

    while (remaining_count > 0 && fromDate < currentToDate) { 
        const chunkSize = Math.min(remaining_count, maxChunkSize);
        let chunkFromDate = new Date(currentToDate.getTime() - chunkSize * minutesPerCandle * 60000);

        if (chunkFromDate < fromDate) {
            chunkFromDate = new Date(fromDate);
        } 
        const params: any = {
            granularity,
            price,
            from: chunkFromDate.toISOString(),
            to: currentToDate.toISOString()
        };

        await new Promise(resolve => setTimeout(resolve, 10));

        const [ok, data] = await this.makeRequest(`instruments/${pairName}/candles`, 'get', 200, params);
        if (ok && data['candles']) {
            const fetchedCandles = data['candles']; 
            allCandles.unshift(...fetchedCandles);

            remaining_count -= fetchedCandles.length;
        } else {
            console.error('ERROR fetchLargeCandles()', params, data);
            remaining_count -= chunkSize;
        }

        currentToDate = new Date(chunkFromDate.getTime());

    }

    console.log('Total fetched candles:', allCandles.length);
    return allCandles;
}


  public async fetchCandles(pairName: string, count: number = 10, granularity: string = 'H1', price: string = 'MBA', dateFrom: Date | null = null, dateTo: Date | null = null) {
    // Fetch candle data. Returns an array of candle data.

    const url = `instruments/${pairName}/candles`;
    const params: any = {
      granularity,
      price,
    };

    if (dateFrom && dateTo) {
      params.from = dateFrom.toISOString();
      params.to = dateTo.toISOString();
    } else {
      params.count = count;
    }

    const [ok, data] = await this.makeRequest(url, 'get', 200, params);
    if (ok && data['candles']) {
      return data['candles'];
    } else {
      console.error('ERROR fetchCandles()', params, data);
      return null;
    }
  } 
  public async getAccountSummary(account_id: string = this.account_id) {
    // Fetch account summary. Returns account summary data.

    return this.getAccountEP("summary", "account", account_id);
  }
  
  public async getPositionSummary(account_id: string = this.account_id) {
    // Fetch position summary. Returns the first position if available.

    const data = await this.getAccountEP("openPositions", "positions", account_id);
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  }

  public async getAccountInstruments(account_id: string = this.account_id) {
    // Fetch account instruments. Returns an array of available instruments.

    return this.getAccountEP("instruments", "instruments", account_id);
  }

  public async getAskBid(instrumentsList: string[]) {
    // Fetch ask and bid prices for given instruments. Returns ask and bid prices.

    const url = `accounts/${this.account_id}/pricing`;
    const params = {
      instruments: instrumentsList.join(","),
      includeHomeConversions: true,
    };

    const [ok, response] = await this.makeRequest(url, 'get', 200, params);
    if (ok && response['prices'] && response['homeConversions']) {
      const prices = response['prices'][0];
      return { ask: prices.ask, bid: prices.bid };
    }
    return null;
  }

  public async getClose() {
    // Fetch latest close price. Returns bid price of the latest close candle.

    const url = `accounts/${this.account_id}/candles/latest`;
    const params = {
      candleSpecifications: 'EUR_USD:S5:BM',
    };

    const [ok, response] = await this.makeRequest(url, 'get', 200, params);
    if (ok && response['latestCandles']) {
      return response['latestCandles'][0]['candles'][0]['bid'];
    }
    return null;
  }

  public async getFilledOrders(account_id: string = this.account_id) {
    // Fetch filled orders for the account. Returns the latest filled order if available.

    const url = `accounts/${account_id}/orders`;
    const params = {
      state: 'ALL',
      count: 1,
    };

    const [ok, response] = await this.makeRequest(url, 'get', 200, params);
    if (ok && response['orders']) {
      const order = response['orders'][0];
      if (order['state'] === 'FILLED') {
        return {
          units: order['units'],
          id: order['id'],
          state: order['state'],
        };
      }
    }
    return null;
  }

  public async placeTrade(pairName: string, units: number, direction: number) {
    // Place a trade order. Returns the ID of the filled order.

    const url = `accounts/${this.account_id}/orders`;
    units = Math.round(units);
    if (direction === -1) {
      units *= -1;
    }

    const data = {
      order: {
        units: units.toString(),
        instrument: pairName,
        type: 'MARKET',
      },
    };

    const [ok, response] = await this.makeRequest(url, 'post', 201, {}, data);
    if (ok && response['orderFillTransaction']) {
      return response['orderFillTransaction']['id'];
    }
    return null;
  }

  public async closePosition(pairName: string, longUnits: number) {
    // Close a position. Returns related transaction IDs.

    const url = `accounts/${this.account_id}/positions/${pairName}/close`;
    const data = longUnits > 0 ? { longUnits: 'ALL' } : { shortUnits: 'ALL' };

    const [ok, response] = await this.makeRequest(url, 'put', 200, {}, data);
    if (ok && response['relatedTransactionIDs']) {
      return response['relatedTransactionIDs'];
    }
    return null;
  }

}

export const OandaApiContext = createContext<OandaApi | null>(null);
export const api = new OandaApi();
