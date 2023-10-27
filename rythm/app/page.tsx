"use client";
import React, { useState, useEffect } from 'react';
import DataTable from "./components/DataTable";
import Stream from "./components/Stream";
import CandleChart from "./components/LineChart";
import { fetchData } from './api/getData'; 

const API_INTERVAL = 5000;  // 5 seconds

function App() {
  const [candleData, setCandleData] = useState([]);

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const data = await fetchData();
        const candles = data?.candles;

        setCandleData(candles || []);
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
      <CandleChart data={candleData} />
      <DataTable />
    </div>
  );
}

export default App;
