"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/app/components/ui/button";
import { BoxArrays, StreamData } from "../../types";
import ResoBox from "./ResoBox";
import { fetchBoxArrays } from "../api/rest";

interface ResoModelProps {
  pair: string;
  streamData: StreamData | null;
  selectedBoxArrayType: string;
}

const ResoModel: React.FC<ResoModelProps> = ({
  pair,
  streamData,
  selectedBoxArrayType,
}) => {
  const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
  const [initializationComplete, setInitializationComplete] =
    useState<boolean>(false);
  const { user } = useUser();

  const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
    null
  );
  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    const fetchAndSetBoxes = async () => {
      if (user && user.id) {
        try {
          const newBoxArrays = await fetchBoxArrays(
            user.id,
            pair,
            selectedBoxArrayType
          );
          setBoxArrays(newBoxArrays);
          setInitializationComplete(true);
        } catch (error) {
          console.error("Error fetching box arrays:", error);
        }
      }
    };

    fetchAndSetBoxes();
    intervalId = setInterval(fetchAndSetBoxes, 60000);

    return () => clearInterval(intervalId);
  }, [user, pair, selectedBoxArrayType]);

  useEffect(() => {
    if (streamData) {
      const bidPrice = streamData.bids?.[0]?.price
        ? parseFloat(streamData.bids[0].price)
        : null;
      const askPrice = streamData.asks?.[0]?.price
        ? parseFloat(streamData.asks[0].price)
        : null;

      if (bidPrice !== null && askPrice !== null) {
        const currentPrice = (bidPrice + askPrice) / 2;
        setCurrentClosePrice(currentPrice);
      }
    }
  }, [streamData]);

  // Render
  if (!initializationComplete) {
    return (
      <div className="w-full h-full flex items-center  justify-center">
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="#333"
            strokeWidth="5"
            fill="none"
            strokeDasharray="31.415, 31.415"
            strokeDashoffset="0">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full h-auto text-teal-400 font-bold">
      <ResoBox boxArrays={boxArrays} />
    </div>
  );
};

export default ResoModel;
