"use client";

import { useEffect, useState } from "react";

import {
  OANDA_BASE_URL,
  OANDA_STREAM_URL,
  OANDA_TOKEN,
  ACCOUNT_ID,
  INSTRUMENT,
} from "../../index";

import { startStreaming } from "../api/getData";

function PriceStream() {
  const [prices, setPrices] = useState({
    GBP_USD: { bid: null, ask: null },
    USD_JPY: { bid: null, ask: null },
  });

  useEffect(() => {
    startStreaming(ACCOUNT_ID, INSTRUMENT, OANDA_TOKEN, (data) => {
      if (data.type === "PRICE") {
        setPrices((prevPrices) => ({
          ...prevPrices,
          [data.instrument]: {
            bid: data.bids[0].price,
            ask: data.asks[0].price,
          },
        }));
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://stream-fxpractice.oanda.com/v3/accounts/${ACCOUNT_ID}/pricing/stream?instruments=${INSTRUMENT}`,
          {
            headers: {
              Authorization: `Bearer ${OANDA_TOKEN}`,
            },
          }
        );

        const reader = response?.body?.getReader();

        const processStream = async () => {
          let buffer = ""; // This will store the concatenated data chunks

          while (true) {
            const result = await (reader?.read() as Promise<
              ReadableStreamReadResult<Uint8Array>
            >);

            if (result?.done) {
              console.log("WebSocket connection closed.");
              break;
            }

            buffer += new TextDecoder().decode(result?.value); // Add new chunk to buffer

            // Attempt to find a newline (assuming your JSON objects are separated by newlines)
            let newlineIndex = buffer.indexOf("\n");
            while (newlineIndex !== -1) {
              const singleJSON = buffer.slice(0, newlineIndex);

              try {
                const data = JSON.parse(singleJSON);
                if (data.type === "PRICE") {
                  setPrices((prevPrices) => ({
                    ...prevPrices,
                    [data.instrument]: {
                      bid: data.bids[0].price,
                      ask: data.asks[0].price,
                    },
                  }));
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }

              buffer = buffer.slice(newlineIndex + 1); // Remove the processed data from buffer
              newlineIndex = buffer.indexOf("\n"); // Look for the next newline
            }
          }
        };

        processStream();
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-3 sm:p-8   items-center bg-gray-800/20">
      <h1 className="text-xs sm:text-xs p-2 sm:p-4 tracking-wide font-bold text-gray-500 uppercase font-mono">
        Live Price
      </h1>

      <div className="mb-2 p-3 rounded-lg bg-gray-600/20">
        <p className="text-gray-400  uppercase text-sm sm:text-base font-bold font-mono">
          GBP/USD:
          {prices.GBP_USD.bid && prices.GBP_USD.ask ? (
            <>
              <span className="text-xxs sm:text-xs text-red-400"> Ask: </span>
              <span className="animate-pulse">{prices.GBP_USD.ask}</span>
              <span className="ml-1 sm:ml-2 text-xxs sm:text-xs text-blue-400">
                {" "}
                Bid:{" "}
              </span>
              <span className="animate-pulse">{prices.GBP_USD.bid}</span>
            </>
          ) : (
            <span className="animate-pulse text-xxs ml-1 p-1 uppercase text-gray-600">
              Loading...
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default PriceStream;
