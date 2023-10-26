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
// api/streamData.ts



export const startStreaming = async (ACCOUNT_ID: string, INSTRUMENT: string, OANDA_TOKEN: string, onData: (data: any) => void) => {
  try {
    const response = await fetch(
      `${OANDA_STREAM_URL}/${ACCOUNT_ID}/pricing/stream?instruments=${INSTRUMENT}`,
      {
        headers: {
          Authorization: `Bearer ${OANDA_TOKEN}`,
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
