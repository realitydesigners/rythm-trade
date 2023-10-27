import React, { useState, useEffect } from 'react';

interface BoxProps {
  currentPrice: number;
  boxSize: number;
  candleData: any[]; 
}

const Box: React.FC<BoxProps> = ({ currentPrice, boxSize, candleData }) => {
  const [RngHigh, setRngHigh] = useState<number>(0);
  const [RngLow, setRngLow] = useState<number>(0);
  const [BoxMovedUp, setBoxMovedUp] = useState<boolean | null>(null); // Initialized to null to determine first box direction
  
  useEffect(() => {
    const initializeBox = () => {
        console.log('Initializing box with candleData:', candleData);
        
        const highs = candleData.map(data => parseFloat(data.h));
        const lows = candleData.map(data => parseFloat(data.l));
      
        let HH = Math.max(...highs);
        let LL = Math.min(...lows);
        
        console.log('Determined HH and LL:', HH, LL);
        
        setRngHigh(HH);
        setRngLow(LL);
        
        // Determining initial direction
        if (BoxMovedUp === null) {
          if (candleData.length >= 2 && candleData[candleData.length - 1].c && candleData[candleData.length - 2].c) {
            const latestClose = parseFloat(candleData[candleData.length - 1].c);
            const prevClose = parseFloat(candleData[candleData.length - 2].c);
            setBoxMovedUp(latestClose > prevClose);
          } else {
            console.error("Insufficient data or missing 'c' property in candleData");
          }
        }
      };
      
    

    const invalidDataPoints = candleData.filter(data => 
        isNaN(parseFloat(data.h)) || isNaN(parseFloat(data.l))
    );

    console.log('Invalid data points:', invalidDataPoints);
    
    initializeBox();
  }, [candleData, boxSize, BoxMovedUp]);
  

  useEffect(() => {
    if (currentPrice > RngHigh + boxSize) {
      setRngHigh(currentPrice);
      setRngLow(currentPrice - boxSize);
      setBoxMovedUp(true);
    } else if (currentPrice < RngLow - boxSize) {
      setRngLow(currentPrice);
      setRngHigh(currentPrice + boxSize);
      setBoxMovedUp(false);
    }
  }, [currentPrice, RngHigh, RngLow, boxSize]);

  const nextChangePrice = BoxMovedUp ? (RngHigh - boxSize) : (RngLow + boxSize);

  return (
    <div>
      <div>Direction: {BoxMovedUp ? "UP" : "DOWN"}</div>
      <div>Box drawn from: {RngHigh}</div>
      <div>Price for next change: {nextChangePrice}</div>
    </div>
  );
};

export default Box;
