"use client"
import React, { useState, useEffect } from 'react';
import DataTable  from "./components/DataTable";
import Stream from "./components/Stream";
import CandleChart from "./components/CandleChart";
import { fetchData } from './api/getData';  // Adjust path

function App() {
  const [candleData, setCandleData] = useState([]);  // Assuming the data structure matches your types

  useEffect(() => {
    // Fetch the candlestick data
    fetchData().then(data => {
      // Extract the candlestick data from the API response
      // Assuming the API returns an object with a 'candles' property that contains the actual candlestick data
      const candles = data?.candles; 
      setCandleData(candles || []);  // Set the data to state, default to empty array if no data
    });
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
