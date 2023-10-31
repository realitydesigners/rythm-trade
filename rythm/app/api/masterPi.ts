import axios, { AxiosResponse } from 'axios';
import { parseISO } from 'date-fns';

const OANDA_BASE_URL = 'https://api-fxtrade.oanda.com/v3'; // Replace with your OANDA URL
const OANDA_TOKEN = ''; // Replace with your OANDA Token
const ACCOUNT_ID = ''; // Replace with your Account ID

export class OandaApi {
  private api_key: string;
  private oanda_url: string;
  private account_id: string;

  constructor(api_key: string = OANDA_TOKEN, oanda_url: string = OANDA_BASE_URL, account_id: string = ACCOUNT_ID) {
    this.api_key = api_key;
    this.oanda_url = oanda_url;
    this.account_id = account_id;
  }

  private async makeRequest(url: string, method: 'get' | 'post' | 'put' = 'get', expectedStatusCode: number = 200, params: any = {}, data: any = {}): Promise<[boolean, any]> {
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
    const url = 'accounts';
    const [ok, data] = await this.makeRequest(url);
    if (ok && data[dataKey]) {
      return data[dataKey];
    } else {
      console.error('ERROR getAccounts()', data);
      return null;
    }
  }




  public async fetchCandles(pairName: string, count: number = 10, granularity: string = 'H1', price: string = 'MBA', dateFrom: Date | null = null, dateTo: Date | null = null) {
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

  public async getAccountSummary(account_id: string) {
    return this.getAccountEP("summary", "account", account_id);
  }

  public async getPositionSummary(account_id: string) {
    const data = await this.getAccountEP("openPositions", "positions", account_id);
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  }

  public async getAccountInstruments(account_id: string) {
    return this.getAccountEP("instruments", "instruments", account_id);
  }

  public async getAskBid(instrumentsList: string[]) {
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

  public async getFilledOrders(account_id: string) {
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
    const url = `accounts/${this.account_id}/positions/${pairName}/close`;
    const data = longUnits > 0 ? { longUnits: 'ALL' } : { shortUnits: 'ALL' };

    const [ok, response] = await this.makeRequest(url, 'put', 200, {}, data);
    if (ok && response['relatedTransactionIDs']) {
      return response['relatedTransactionIDs'];
    }
    return null;
  }

}
