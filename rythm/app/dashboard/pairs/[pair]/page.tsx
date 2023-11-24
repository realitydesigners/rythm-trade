"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import DataTable from '@/app/components/DataTable';
import Stream from '@/app/components/Stream';
import LineChart from '@/app/components/Linechart';
import BoxesModel from '@/app/components/BoxesModel';
import MasterPosition from '@/app/components/MasterPosition';
import { OandaApiContext, api } from '@/app/api/OandaApi';
import styles from './PairPage.module.css';
import ElixrModel from '@/app/components/ElixrModel';
import ResoModel from '@/app/components/ResoModel';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { BOX_SIZES } from '@/app/utils/constants';



const PairPage = () => {
  const params = useParams();
  let pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || ''; 
  const [streamData, setStreamData] = useState<{ [pair: string]: any }>({}); 
  const [positionData, setPositionData] = useState(null);
  // State for selected box array type
  const [selectedBoxArrayType, setSelectedBoxArrayType] = useState<string>('d');

  // Function to handle change in selected box array type
  const handleBoxArrayTypeChange = (newType: string) => {
    setSelectedBoxArrayType(newType);
  };
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

    const fetchPosition = async () => {
      const position = await api.getPairPositionSummary(pair);
      setPositionData(position);
    };

    fetchPosition();
    const intervalId = setInterval(fetchPosition, 1000);

    return () => {
      api.unsubscribeFromPairs([pair]);
      clearInterval(intervalId);
    };
  }, [pair]);
  
  return (
    <OandaApiContext.Provider value={api}>

      <div className={styles.container}>
        <a href="/" className={styles.backLink}> --BACK</a>
        <h1 className={styles.title}>{pair}</h1>
        <Stream pair={pair} data={streamData[pair]} />

        <ResoModel pair={pair} streamData={streamData[pair]} selectedBoxArrayType={selectedBoxArrayType} />
        <Select value={selectedBoxArrayType} onValueChange={handleBoxArrayTypeChange}>
          <SelectTrigger>
            <SelectValue>{selectedBoxArrayType}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.keys(BOX_SIZES).map(arrayKey => (
              <SelectItem key={arrayKey} value={arrayKey}>
                {arrayKey}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ElixrModel pair={pair} streamData={streamData[pair]} />

        {positionData && <MasterPosition positionData={[positionData]} />}
        {!positionData && <p>No position data available for {pair}</p>}
      </div>
    </OandaApiContext.Provider>
  );
};

export default PairPage;
