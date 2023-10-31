"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';
import DataTable from "./components/DataTable";
import Stream from "./components/Stream";
import LineChart from "./components/LineChart";
import BoxChart from './components/BoxChart';
import MasterProfile from './components/MasterProfile';
import { OandaApi } from './api/OandaApi';

const API_INTERVAL = 5000;  // 5 seconds
const BOX_SIZE = 1;  // Define your box size here, assuming 10 for this example

export const OandaApiContext = createContext<OandaApi | null>(null);
const api = new OandaApi();
console.log("api", api)

function App() {
  
  const [candleData, setCandleData] = useState([]); 
  const [currentPrice, setCurrentPrice] = useState(0);  // New state for current price

  useEffect(() => {
    const fetchCandleData = async () => {
      try {

        const data = await api.chartData();
        const candles = data?.candles;

        setCandleData(candles || []);
        
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
      <OandaApiContext.Provider value={api}> 
        <Stream />
        <MasterProfile />
        <BoxChart/>
        <LineChart data={candleData} />
        <DataTable />
      </OandaApiContext.Provider>

    </div>
  );
}

export default App;
