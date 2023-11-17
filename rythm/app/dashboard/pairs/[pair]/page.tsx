"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DataTable from '@/app/components/DataTable';
import Stream from '@/app/components/Stream';
import LineChart from '@/app/components/Linechart';
import BoxesModel from '@/app/components/BoxesModel';
import { OandaApiContext, api } from '@/app/api/OandaApi';
import styles from './PairPage.module.css';


const PairPage = () => {
  const params = useParams();
  let pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || ''; 
  const [streamData, setStreamData] = useState<{ [pair: string]: any }>({}); 

  useEffect(() => {
    const handleStreamData = (data: any, pair: string) => {   
      if (data.type !== "HEARTBEAT") {
        setStreamData((prevData) => ({
          ...prevData,
          [pair]: data,
        }));
      }
    };
  
    api.subscribeToPairs([pair], handleStreamData);
  
    return () => {
      api.unsubscribeFromPairs([pair]);
    };
  }, [pair]);
  
  return (
    <OandaApiContext.Provider value={api}>
      
      <div className={styles.container}>
      <a href="/" className={styles.backLink}> --BACK</a>
        <h1 className={styles.title}>{pair}</h1>
        <Stream pair={pair} data={streamData[pair]} />
        <BoxesModel pair={pair} streamData={streamData[pair]} />
      </div>
    </OandaApiContext.Provider>
  );
};

export default PairPage;
