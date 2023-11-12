"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DataTable from "../../../components/DataTable";
import Stream from "../../../components/Stream";
import LineChart from "../../../components/LineChart";
import BoxChart from '../../../components/BoxChart';
import { OandaApiContext, api } from '../../../api/OandaApi';

const API_INTERVAL = 5000;



const PairPage = () => {
  const params = useParams();
  let pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || '';


  const [candleData, setCandleData] = useState([]); 
  const [currentPrice, setCurrentPrice] = useState(0);

  console.log(pair)
  useEffect(() => {
    const fetchCandleData = async () => {
      try {

        const data = await api?.chartData();
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
    <OandaApiContext.Provider value={api}>
      <a href="/" className='text-gray-400 font-bold'>BACK</a>
      <div className='w-full pl-10 pr-10 pt-2 pb-2 bg-black rounded-lg shadow-lg text-sm space-y-1 font-mono text-gray-200'>
        <h1 className='text-gray-400 font-bold border-b border-gray-600 pb-2'>{pair}</h1>
        <Stream pair={pair} />
        <BoxChart />
        <LineChart data={candleData} />
        <DataTable />
      </div>
    </OandaApiContext.Provider>
  );
};

export default PairPage;
