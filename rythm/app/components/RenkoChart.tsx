"use client";
import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  OANDA_BASE_URL,
  OANDA_STREAM_URL,
  OANDA_TOKEN,
  ACCOUNT_ID,
  INSTRUMENT,
} from "../api/index";

function RenkoChart() {
  const [renkoData, setRenkoData] = useState<
    { id: string; time: string; close: number; direction: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${OANDA_BASE_URL}/accounts/${ACCOUNT_ID}/instruments/${INSTRUMENT}/candles?price=M&granularity=M1`,
          {
            headers: {
              Authorization: `Bearer ${OANDA_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        setRenkoData(
          result.candles.map(
            (candle: { mid: { c: string }; time: string }) => ({
              id: uuidv4(),
              time: candle.time,
              close: parseFloat(candle.mid.c),
              direction: "",
            })
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateRenkoChart = useCallback(() => {
    if (renkoData.length === 0) {
      return; // Exit early if renkoData is empty
    }

    const renkoChart = [];
    let previousClose = renkoData[0].close;
    let direction = "";

    for (let i = 1; i < renkoData.length; i++) {
      const currentClose = renkoData[i].close;
      const difference = Math.abs(currentClose - previousClose);

      if (difference >= 10) {
        direction = currentClose > previousClose ? "up" : "down";
        const renkoItem = {
          id: uuidv4(),
          time: renkoData[i].time,
          close: currentClose,
          direction: direction,
        };
        renkoChart.push(renkoItem);
        previousClose = currentClose;
      }
    }

    setRenkoData(renkoChart);
  }, [renkoData]);

  useEffect(() => {
    calculateRenkoChart();
  }, [renkoData, calculateRenkoChart]);

  return (
    <div className="bg-gray-800/20  p-4">
      <div className="bg-gray-600/20 p-40 w-full h-full">
        {renkoData.map((item) => (
          <div
            key={item.id}
            className={`bg-${
              item.direction === "up" ? "green" : "red"
            }-500 w-10 h-10 m-2`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default RenkoChart;
