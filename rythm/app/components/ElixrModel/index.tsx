'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { CandleData, StreamData } from '../../../types';
import { OandaApiContext } from '../../api/OandaApi';
import { symbolsToDigits } from '@/app/utils/constants';
import ElixrBot from '@/app/algorithms/ElixrBot';
import { Button } from '../Shadcn/button';

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
  const elixrInstance = useRef<ElixrBot | null>(null);

  const [initializationComplete, setInitializationComplete] = useState<boolean>(false);
  const [trendlines, setElixrs] = useState<{
    elixrMax: Elixr[];
    elixrMin: Elixr[];
  } | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceToElixrRatio, setPriceToElixrRatio] = useState<number>(0.5);
  const [intersectingPrice, setIntersectingPrice] = useState<number>(0);
  const [botActive, setBotActive] = useState(false);

  const toggleBot = () => {
    if (elixrInstance.current) {
      elixrInstance.current.toggleActive();
      setBotActive(!botActive);
    }
  };
  useEffect(() => {
    if (api) {
      elixrInstance.current = new ElixrBot(pair, api);

      // Check if the instance is not null before calling the method
      if (elixrInstance.current) {
        elixrInstance.current.startDataCollection();
      }

      // Cleanup function to stop data collection when the component unmounts
      return () => {
        if (elixrInstance.current) {
          elixrInstance.current.stopDataCollection();
        }
      };
    }
  }, [api, pair]);

  const findLocalExtrema = (data: number[], findMax: boolean, numCandles: number = 5): number[] => {
    const extrema: number[] = [];
    for (let i = numCandles; i < data.length - numCandles; i++) {
      let isExtrema = true;
      for (let j = 1; j <= numCandles; j++) {
        if (findMax) {
          if (data[i] <= data[i - j] || data[i] <= data[i + j]) {
            isExtrema = false;
            break;
          }
        } else {
          if (data[i] >= data[i - j] || data[i] >= data[i + j]) {
            isExtrema = false;
            break;
          }
        }
      }
      if (isExtrema) {
        extrema.push(i);
      }
    }
    return extrema;
  };

  const pairPointValue = symbolsToDigits[pair]?.point || 0.00001;

  const checkTouch = (price: number, index: number, elixr: Elixr): boolean => {
    const expectedPrice = elixr.slope * index + elixr.intercept;
    const threshold = pairPointValue * 30;
    return Math.abs(price - expectedPrice) < threshold;
  };

  const countTouches = (prices: number[], elixrs: Elixr[]): Elixr[] => {
    return elixrs.map(elixr => {
      let touchCount = 0;
      prices.forEach((price, index) => {
        if (checkTouch(price, index, elixr)) {
          touchCount++;
        }
      });
      return { ...elixr, touches: touchCount };
    });
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
  function calculateElixrIntersection(elixrMax: { intercept: number; slope: number }, elixrMin: { intercept: number; slope: number }) {
    if (elixrMax.slope === elixrMin.slope || (elixrMax.slope < elixrMin.slope && elixrMax.intercept < elixrMin.intercept) || (elixrMax.slope > elixrMin.slope && elixrMax.intercept > elixrMin.intercept)) {
      return null;
    }

    const xIntersection = (elixrMin.intercept - elixrMax.intercept) / (elixrMax.slope - elixrMin.slope);
    const intersectingPrice = elixrMax.slope * xIntersection + elixrMax.intercept;

    return intersectingPrice;
  }

  const calculateElixrs = (oandaData: CandleData[]): { elixrMax: Elixr[]; elixrMin: Elixr[] } => {
    const highs = oandaData.map(data => parseFloat(data.mid.h));
    const lows = oandaData.map(data => parseFloat(data.mid.l));

    const maxIdx = findLocalExtrema(highs, true);
    const minIdx = findLocalExtrema(lows, false);

    const elixrMax: Elixr[] = [];
    const elixrMin: Elixr[] = [];

    for (let i = 0; i < maxIdx.length - 1; i++) {
      const x = [maxIdx[i], maxIdx[i + 1]];
      const y = [highs[x[0]], highs[x[1]]];
      const { slope, intercept } = calculateSlope(x, y);
      elixrMax.push({ slope, intercept, touches: 0 });
    }

    for (let i = 0; i < minIdx.length - 1; i++) {
      const x = [minIdx[i], minIdx[i + 1]];
      const y = [lows[x[0]], lows[x[1]]];
      const { slope, intercept } = calculateSlope(x, y);
      elixrMin.push({ slope, intercept, touches: 0 });
    }

    const touchedElixrMax = countTouches(highs, elixrMax).filter(elixr => elixr.touches >= 10);
    const touchedElixrMin = countTouches(lows, elixrMin).filter(elixr => elixr.touches >= 10);

    return { elixrMax: touchedElixrMax, elixrMin: touchedElixrMin };
  };

  const calculateAverageElixr = (elixrs: Elixr[]): Elixr => {
    const numElixrs = elixrs.length;
    if (numElixrs === 0) {
      return { slope: 0, intercept: 0, touches: 0 };
    }

    let totalSlope = 0;
    let totalIntercept = 0;
    let totalTouches = 0;

    elixrs.forEach(elixr => {
      totalSlope += elixr.slope;
      totalIntercept += elixr.intercept;
      totalTouches += elixr.touches;
    });

    const averageSlope = totalSlope / numElixrs;
    const averageIntercept = totalIntercept / numElixrs;
    const averageTouches = totalTouches / numElixrs;

    return {
      slope: averageSlope,
      intercept: averageIntercept,
      touches: averageTouches,
    };
  };
  const generateMasterElixrsAndUpdatePrice = (oandaData: CandleData[]) => {
    const elixrs = calculateElixrs(oandaData);

    const averageElixrMax = calculateAverageElixr(elixrs.elixrMax);
    const averageElixrMin = calculateAverageElixr(elixrs.elixrMin);

    setElixrs({ elixrMax: [averageElixrMax], elixrMin: [averageElixrMin] });

    const intersectPrice = calculateElixrIntersection(averageElixrMax, averageElixrMin);
    if (intersectPrice !== null) {
      setIntersectingPrice(intersectPrice);
    } else {
      console.log('No intersection between elixrs');
    }
    setInitializationComplete(true);
  };

  const updatePriceToElixrRatio = () => {
    if (trendlines && trendlines.elixrMax.length > 0 && trendlines.elixrMin.length > 0) {
      const maxElixrLastIndex = trendlines.elixrMax.length - 1;
      const minElixrLastIndex = trendlines.elixrMin.length - 1;
      const maxElixrPrice = trendlines.elixrMax[0].slope * maxElixrLastIndex + trendlines.elixrMax[0].intercept;
      const minElixrPrice = trendlines.elixrMin[0].slope * minElixrLastIndex + trendlines.elixrMin[0].intercept;

      if (currentPrice > maxElixrPrice) {
        setPriceToElixrRatio(1.0);
      } else if (currentPrice < minElixrPrice) {
        setPriceToElixrRatio(0.0);
      } else {
        const distanceToMax = Math.abs(currentPrice - maxElixrPrice);
        const distanceToMin = Math.abs(currentPrice - minElixrPrice);
        const totalDistance = distanceToMax + distanceToMin;
        const ratio = totalDistance > 0 ? distanceToMin / totalDistance : 0.5;
        setPriceToElixrRatio(ratio);
      }
    }
  };

  useEffect(() => {
    if (streamData && initializationComplete && elixrInstance.current) {
      const bidPrice = streamData.bids?.[0]?.price ? parseFloat(streamData.bids[0].price) : null;
      const askPrice = streamData.asks?.[0]?.price ? parseFloat(streamData.asks[0].price) : null;

      if (bidPrice !== null && askPrice !== null) {
        const currentPrice = (bidPrice + askPrice) / 2;
        setCurrentPrice(currentPrice);

        elixrInstance.current.onData(currentPrice, priceToElixrRatio, intersectingPrice);
      }
    }
  }, [streamData, initializationComplete, currentPrice, priceToElixrRatio, intersectingPrice]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchAndCalculateElixrs = async () => {
      const oandaData = await api?.fetchLargeCandles(pair, 6000, 'M1');
      if (oandaData && oandaData.length > 0) {
        generateMasterElixrsAndUpdatePrice(oandaData);
      } else {
      }
    };

    fetchAndCalculateElixrs();
    intervalId = setInterval(fetchAndCalculateElixrs, 60000);

    return () => clearInterval(intervalId);
  }, [pair]);

  useEffect(() => {
    updatePriceToElixrRatio();
  }, [currentPrice, trendlines]);

  return (
    <div className="w-full h-auto text-teal-400 font-bold">
      {initializationComplete ? (
        <>
          <div>Price to Elixr Ratio: {priceToElixrRatio.toFixed(2)}</div>
          <div>Intersecting Price: {intersectingPrice.toFixed(5)}</div>
          <div className="w-full flex justify-center items-center gap-2">
            {/* Using Button component for consistency */}
            <Button onClick={toggleBot}>{botActive ? 'Turn Off Bot' : 'Turn On Bot'}</Button>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ElixrModel;
