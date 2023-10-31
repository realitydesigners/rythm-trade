"use client";
import React, { useState, useEffect } from 'react';
import DataTable from "./components/DataTable";
import Stream from "./components/Stream";
import LineChart from "./components/LineChart";
import { chartData } from './api/getData'; 
import BoxChart from './components/BoxChart';
import MasterProfile from './components/MasterProfile';

const API_INTERVAL = 5000;  // 5 seconds
const BOX_SIZE = 1;  // Define your box size here, assuming 10 for this example

function App() {
  const [candleData, setCandleData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);  // New state for current price

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const data = await chartData();
        const candles = data?.candles;

        setCandleData(candles || []);

        // Update the current price based on the last available candle's close price
        const latestPrice = candles?.[candles.length - 1]?.close?.out; 
        if (latestPrice) {
          setCurrentPrice(latestPrice);
        }
      } catch (error) {
        console.error('Error fetching candle data:', error);
      }
    };

    fetchCandleData();

    const interval = setInterval(fetchCandleData, API_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Stream />
      <MasterProfile />
      <BoxChart/>
      <LineChart data={candleData} />
      <DataTable />
    </div>
  );
}

export default App;
