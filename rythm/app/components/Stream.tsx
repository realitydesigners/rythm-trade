"use client";

import { useEffect, useState, useContext } from "react";
import { ForexData } from  "@/types";
import { OandaApiContext } from '../api/OandaApi'; 

function Stream() {
  const [prices, setPrices] = useState<ForexData | null>(null);
  const api = useContext(OandaApiContext);

  useEffect(() => {
    if (api) {
      api.startStreaming('GBP_USD', (data) => {
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
    }
  }, [api]);

  return (
    <div className="p-3 sm:p-8 items-center bg-black">
      <h1 className="text-xs sm:text-xs p-2 sm:p-4 tracking-wide font-bold text-gray-500 uppercase font-mono">
        Live Price
      </h1>

      <div className="mb-2 p-3 rounded-lg bg-black border border-gray-600/20">
        <p className="text-gray-400 uppercase text-sm sm:text-base font-bold font-mono">
          GBP/USD:
          {prices && prices.GBP_USD && prices.GBP_USD.bid && prices.GBP_USD.ask ? (
            <>
          
              <span className="ml-1 sm:ml-2 text-xxs sm:text-xs text-blue-400"> Bid: </span>
              <span className="animate-pulse">{prices.GBP_USD.bid}</span>
              <span className="text-xxs sm:text-xs text-red-400"> Ask: </span>
              <span className="animate-pulse">{prices.GBP_USD.ask}</span>
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

export default Stream;
