'use client';

import React, { useState, useEffect, useContext } from 'react';
import { CandleData, StreamData } from '../../../types';
import { OandaApiContext } from '../../api/OandaApi';

interface ElixrModelProps {
   pair: string;
   streamData: StreamData | null;
}
interface Elixr {
   slope: number;
   intercept: number;
   touches: number;
}
const ElixrModel: React.FC<ElixrModelProps> = ({ pair, streamData }) => {
   const api = useContext(OandaApiContext);
   const [initializationComplete, setInitializationComplete] = useState<boolean>(false);
   const [trendlines, setElixrs] = useState<{ elixrMax: Elixr[]; elixrMin: Elixr[] } | null>(null);

   const findLocalExtrema = (data: number[], findMax: boolean): number[] => {
      const extrema: number[] = [];
      for (let i = 1; i < data.length - 1; i++) {
         if (findMax ? data[i] > data[i - 1] && data[i] > data[i + 1] : data[i] < data[i - 1] && data[i] < data[i + 1]) {
            extrema.push(i);
         }
      }
      return extrema;
   };
   const calculateSlope = (x: number[], y: number[]): { slope: number; intercept: number } => {
      if (x.length !== 2 || y.length !== 2) {
         throw new Error('calculateSlope function expects exactly two points');
      }

      const [x1, x2] = x;
      const [y1, y2] = y;
      const slope = (y2 - y1) / (x2 - x1);
      const intercept = y1 - slope * x1;

      return { slope, intercept };
   };

   const calculateElixrs = (oandaData: CandleData[]): { elixrMax: Elixr[]; elixrMin: Elixr[] } => {
      // Ensure the mapping produces number arrays
      const highs = oandaData.map(data => parseFloat(data.mid.h));
      const lows = oandaData.map(data => parseFloat(data.mid.l));

      const maxIdx = findLocalExtrema(highs, true);
      const minIdx = findLocalExtrema(lows, false);

      const elixrMax: Elixr[] = [];
      const elixrMin: Elixr[] = [];

      // Calculate trendlines for maxima
      for (let i = 0; i < maxIdx.length - 1; i++) {
         const x = [maxIdx[i], maxIdx[i + 1]];
         const y = [highs[x[0]], highs[x[1]]];
         const { slope, intercept } = calculateSlope(x, y);
         elixrMax.push({ slope, intercept, touches: 0 });
      }

      // Calculate trendlines for minima
      for (let i = 0; i < minIdx.length - 1; i++) {
         const x = [minIdx[i], minIdx[i + 1]];
         const y = [lows[x[0]], lows[x[1]]];
         const { slope, intercept } = calculateSlope(x, y);
         elixrMin.push({ slope, intercept, touches: 0 });
      }

      return { elixrMax, elixrMin };
   };

   // Fetches candle data at regular intervals and calculates trendlines based on this data.
   useEffect(() => {
      let intervalId: NodeJS.Timeout;

      const fetchAndCalculateElixrs = async () => {
         const oandaData = await api?.fetchLargeCandles(pair, 6000, 'M1');
         if (oandaData && oandaData.length > 0) {
            const calculatedElixrs = calculateElixrs(oandaData);
            setElixrs(calculatedElixrs);
            setInitializationComplete(true);
         } else {
            console.log('No valid data received.');
         }
      };

      fetchAndCalculateElixrs();
      intervalId = setInterval(fetchAndCalculateElixrs, 60000);

      return () => clearInterval(intervalId);
   }, [pair]);

   const renderElixrSummary = () => {
      if (!trendlines) return <p>No trendlines calculated.</p>;

      return (
         <>
            <div>
               <strong>Maxima Elixrs:</strong> Count - {trendlines.elixrMax.length}
            </div>
            <div>
               <strong>Minima Elixrs:</strong> Count - {trendlines.elixrMin.length}
            </div>
         </>
      );
   };

   // Render
   if (!initializationComplete) {
      return (
         <div className="w-full h-full flex items-center justify-center">
            <div>Loading...</div>
         </div>
      );
   }

   return (
      <div className="w-full h-auto text-teal-400 font-bold">
         <div>just workshopping</div>
         {initializationComplete ? renderElixrSummary() : <div>Loading...</div>}
      </div>
   );
};

export default ElixrModel;
