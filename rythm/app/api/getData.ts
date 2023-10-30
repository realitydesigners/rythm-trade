import axios from "axios";


import {
  OANDA_BASE_URL,
  OANDA_STREAM_URL,
  OANDA_TOKEN,
  ACCOUNT_ID,
  INSTRUMENT,
} from "../../index";

export interface StreamData {
  type: string;
  time: string;
  symbol: string;
  price: number;
}

export const startStreaming = async (ACCOUNT_ID: string, INSTRUMENT: string, OANDA_TOKEN: string, onData: (data: any) => void) => {
  try {
    const response = await fetch(
      `${OANDA_STREAM_URL}/accounts/${ACCOUNT_ID}/pricing/stream?instruments=${INSTRUMENT}`,
      {
        headers: {
          Authorization: `Bearer ${OANDA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reader = response?.body?.getReader();

    let buffer = ""; // This will store the concatenated data chunks

    while (true) {
      const result = await (reader?.read() as Promise<ReadableStreamReadResult<Uint8Array>>);

      if (result?.done) {
        console.log("WebSocket connection closed.");
        break;
      }

      buffer += new TextDecoder().decode(result?.value); // Add new chunk to buffer

      let newlineIndex = buffer.indexOf("\n");
      while (newlineIndex !== -1) {
        const singleJSON = buffer.slice(0, newlineIndex);

        try {
          const data = JSON.parse(singleJSON);
          onData(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }

        buffer = buffer.slice(newlineIndex + 1); // Remove the processed data from buffer
        newlineIndex = buffer.indexOf("\n"); // Look for the next newline
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const fetchData = async () => {
  if (!OANDA_TOKEN || !ACCOUNT_ID) {
    console.error("Missing necessary environment variables (OANDA_TOKEN or ACCOUNT_ID).");
    return null;
  }

  try {
    const response = await axios.get(
      `${OANDA_BASE_URL}/accounts/${ACCOUNT_ID}/instruments/${INSTRUMENT}/candles?granularity=M1&count=100`,
      {
        headers: {
          Authorization: `Bearer ${OANDA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from Oanda. Status Code: ${response.status}`);
    }

    const candleData = response.data.candles.map((candle: any) => ({
      time: candle.time,
      mid: {
        o: candle.mid.o,
        c: candle.mid.c,
        h: candle.mid.h,
        l: candle.mid.l,
      },
    }));

    return candleData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};




export const tableData = async () => {
  // Check for the presence of required environment variables
  if (!OANDA_TOKEN || !ACCOUNT_ID) {
    console.error(
      "Missing necessary environment variables (OANDA_TOKEN or ACCOUNT_ID)."
    );
    return null;
  }

  try {
    const response = await axios.get(
      `${OANDA_BASE_URL}/accounts/${ACCOUNT_ID}/instruments/GBP_USD/candles?granularity=M1&count=100`,
      {
        headers: {
          Authorization: `Bearer ${OANDA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch data from Oanda. Status Code: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
