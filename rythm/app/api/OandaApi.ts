import axios, { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';


import {
  OANDA_BASE_URL,
  OANDA_STREAM_URL,
  OANDA_TOKEN,
  ACCOUNT_ID,
  INSTRUMENT,
} from "../../index";

export class OandaApi {
  private api_key: string;
  private oanda_url: string;
  private account_id: string;

  constructor(api_key: string = OANDA_TOKEN, oanda_url: string = OANDA_BASE_URL, account_id: string = ACCOUNT_ID) {
    // Initialize Oanda API with optional API key, base URL, and account ID. 

    this.api_key = api_key;
    this.oanda_url = oanda_url;
    this.account_id = account_id;
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
  
  public async fetchLargeCandles(pairName: string, total_count: number = 1000, granularity: string = 'H1', price: string = 'MBA', dateFrom: Date | null = null, dateTo: Date | null = null) {
    // Fetch large chunks of candle data. Returns an array of candle data.

    const maxChunkSize = 500;
    let remaining_count = total_count;
    let lastFetchedTime: string | null = null;
    const allCandles: any[] = [];
  
    while (remaining_count > 0) {
      const currentChunkSize = Math.min(maxChunkSize, remaining_count);
      const params: any = {
        granularity,
        price,
        count: currentChunkSize,
      };
  
      if (dateFrom && dateTo) {
        params.from = dateFrom.toISOString();
        params.to = dateTo.toISOString();
      } else if (lastFetchedTime) {
        params.to = lastFetchedTime;
      }
  
      const [ok, data] = await this.makeRequest(`instruments/${pairName}/candles`, 'get', 200, params);
      if (ok && data['candles']) {
        allCandles.unshift(...data['candles']);
        lastFetchedTime = data['candles'][0]?.time || null;
        remaining_count -= currentChunkSize;
      } else {
        console.error('ERROR fetchCandles()', params, data);
        break;
      }
    }
    
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

  public async getCandlesDF(pairName: string, count: number = 10, granularity: string = 'H1', price: string = 'MBA', dateFrom: Date | null = null, dateTo: Date | null = null) {
    // Transform candle data into a more structured format. Returns an array of transformed data.

    const candles = await this.fetchCandles(pairName, count, granularity, price, dateFrom, dateTo);
    if (!candles) return null;

    const finalData: any[] = [];

    for (const candle of candles) {
      if (!candle.complete) continue;

      const newDict: any = {};
      newDict.time = parseISO(candle.time);
      newDict.volume = candle.volume;

      const prices = ['mid', 'bid', 'ask'];
      const ohlc = ['o', 'h', 'l', 'c'];

      for (const p of prices) {
        if (candle[p]) {
          for (const o of ohlc) {
            newDict[`${p}_${o}`] = parseFloat(candle[p][o]);
          }
        }
      }

      finalData.push(newDict);
    }

    return finalData;
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
  
  public async startStreaming(instrument: string, onData: (data: any) => void) { 
    // Start streaming price data for a given instrument. Calls onData with each new data point.

    try {
      const response = await fetch(
        `${OANDA_STREAM_URL}/accounts/${this.account_id}/pricing/stream?instruments=${instrument}`,
        {
          headers: {
            Authorization: `Bearer ${this.api_key}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reader = response?.body?.getReader();
      let buffer = "";

      while (true) {
        const result = await (reader?.read() as Promise<ReadableStreamReadResult<Uint8Array>>);
        if (result?.done) {
          console.log("WebSocket connection closed.");
          break;
        }
        buffer += new TextDecoder().decode(result?.value);

        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex !== -1) {
          const singleJSON = buffer.slice(0, newlineIndex);
          try {
            const data = JSON.parse(singleJSON);
            onData(data);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }

          buffer = buffer.slice(newlineIndex + 1);
          newlineIndex = buffer.indexOf("\n");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  public async fetchData() { 
    // Fetch candle data with granularity M1 and count 300. Returns an array of candle data.

    const url = `accounts/${this.account_id}/instruments/${INSTRUMENT}/candles?granularity=M1&count=300`;
    const [ok, data] = await this.makeRequest(url);
    if (ok && data['candles']) {
      return data['candles'].map((candle: any) => ({
        time: candle.time,
        mid: {
          o: candle.mid.o,
          c: candle.mid.c,
          h: candle.mid.h,
          l: candle.mid.l,
        },
      }));
    } else {
      console.error("Error fetching data:", data);
      return null;
    }
  }

  
  public async chartData() {
    // Fetch GBP_USD candle data with granularity M1 and count 300. Returns raw data.

    const url = `accounts/${this.account_id}/instruments/GBP_USD/candles?granularity=M1&count=300`;
    const [ok, data] = await this.makeRequest(url);
    if (ok && data) {
      return data;
    } else {
      console.error("Error fetching data:", data);
      return null;
    }
  }
  
}
