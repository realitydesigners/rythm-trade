"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DataTable from '@/app/components/DataTable';
import Stream from '@/app/components/Stream';
import LineChart from '@/app/components/Linechart';
import BoxesModel from '@/app/components/BoxesModel';
import { OandaApiContext, api } from '@/app/api/OandaApi';
import styles from './PairPage.module.css';

const API_INTERVAL = 60000;

const PairPage = () => {
  const params = useParams();
  let pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || '';

  const [candleData, setCandleData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const fetchCandleData = async () => {
      try {
        const candles = await api?.fetchCandles(pair, 300, 'M1');

        if (candles) {
          setCandleData(candles);
          const latestPrice = candles[candles.length - 1]?.mid?.c; 
          if (latestPrice) {
            setCurrentPrice(latestPrice);
          }
        }
      } catch (error) {
        console.error('Error fetching candle data:', error);
      }
    };

    fetchCandleData();
    const interval = setInterval(fetchCandleData, API_INTERVAL);

    return () => clearInterval(interval);
  }, [pair]);

  return (
    <OandaApiContext.Provider value={api}>
      <a href="/" className={styles.backLink}>BACK</a>
      <div className={styles.container}>
        <h1 className={styles.title}>{pair}</h1>
        <Stream pair={pair} />
        <BoxesModel pair={pair} />
        <LineChart data={candleData} />
        
        <DataTable pair={pair} />
      </div>
    </OandaApiContext.Provider>
  );
};

export default PairPage;
