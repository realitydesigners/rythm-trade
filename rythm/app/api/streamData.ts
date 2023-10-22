import {
  OANDA_BASE_URL,
  OANDA_STREAM_URL,
  OANDA_TOKEN,
  ACCOUNT_ID,
  INSTRUMENT,
} from "./index";

export interface StreamData {
  type: string;
  time: string;
  symbol: string;
  price: number;
}

export const startStream = (callback: (data: StreamData) => void) => {
  const ws = new WebSocket(OANDA_STREAM_URL);

  ws.addEventListener("open", () => {
    ws.send(`v3/accounts/${ACCOUNT_ID}/pricing/stream/?instruments=EUR_USD`);
    ws.send(`Authorization: Bearer ${OANDA_TOKEN}`);
  });

  ws.addEventListener("message", (event) => {
    const parsedData: StreamData = JSON.parse(event.data);
    if (parsedData.type !== "HEARTBEAT") {
      callback(parsedData);
    }
  });

  ws.addEventListener("error", (event) => {
    console.error(`Error occurred: ${event}`);
  });
};
