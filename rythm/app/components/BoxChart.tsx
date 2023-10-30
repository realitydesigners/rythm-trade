"use client"
import React, { useState, useEffect } from 'react';
import { CandleData } from '../../types';
import { fetchData } from '../api/getData';
import { findCurrentPrice, findHighest, findLowest } from '../api/priceAnalysis';

interface Box {
    high: number;
    low: number;
    boxMovedUp: boolean;
    boxMovedDn: boolean;
    rngSize: number;
}
const convertPointsToDigits = (points: number, price: number) => {
    return points / price;
};




const BoxChart: React.FC = () => {
    const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(null);
    const [currentDirection, setCurrentDirection] = useState<string | null>(null);
    const [boxArray, setBoxArray] = useState<Box[]>([]);
    const [initializationComplete, setInitializationComplete] = useState<boolean>(false);
    const [lowestIndex, setLowestIndex] = useState<number | null>(null);
    const [highestIndex, setHighestIndex] = useState<number | null>(null);
    let oandaData: CandleData[] = []; // Initialize it as an empty array


    const numBoxes = 5;
    const boxSizePoints = 10.0;

    const BoxMovedUp = new Array(numBoxes).fill(false);
    const BoxMovedDn = new Array(numBoxes).fill(false);
    const RngHigh = new Array(numBoxes).fill(null);
    const RngLow = new Array(numBoxes).fill(null);
    const RngSize = new Array(numBoxes).fill(null);

    let Point = 10; 

    useEffect(() => {
        const initializeData = async () => {
            try {
                oandaData = await fetchData();

                if (oandaData && oandaData.length > 0) {
                    const currentPrice = findCurrentPrice(oandaData);
                    if (currentPrice !== undefined) {
                        setCurrentClosePrice(currentPrice);
                    }

                    const highestHighIdx = findHighest(oandaData, 0, oandaData.length - 1) || null;
                    const lowestLowIdx = findLowest(oandaData, 0, oandaData.length - 1) || null;

                    setHighestIndex(highestHighIdx);
                    setLowestIndex(lowestLowIdx);

                    const previousPrice = parseFloat(oandaData[1].mid.c);
                    if (currentPrice !== undefined) {
                        setCurrentDirection(currentPrice > previousPrice ? 'UP' : 'DOWN');
                        calculateBoxes(currentPrice, boxSizePoints, oandaData, false); // Assuming quickInit is set to false initially
                    }

                    setInitializationComplete(true);
                } else {
                    console.log("No valid data received.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        initializeData();
    }, []);

    if (oandaData && oandaData.length > 0) {
        const lastCandle = oandaData[oandaData.length - 1];
        const C = parseFloat(lastCandle.mid.c);
        // Now you can use C safely
    }
   
    const calculateBoxes = (C: number, boxSizePoints: number, oandaData: CandleData[], quickInit: boolean) => {
        if (typeof C === 'undefined') {
            return;
        }
    
        console.log("C:", C);
        console.log("boxSizePoints:", boxSizePoints);
    
        if (quickInit) {
            let minHH = Number.MAX_VALUE;
            let maxLL = Number.MIN_VALUE;
            for (let i = 0; i < oandaData.length; i++) {
                const price = parseFloat(oandaData[i].mid.c);
                if (price > maxLL) {
                    maxLL = price;
                }
                if (price < minHH) {
                    minHH = price;
                }
    
                if (maxLL - minHH >= boxSizePoints * Point) {
                    break;
                }
            }
    
            for (let b = 0; b < numBoxes; b++) {
                RngHigh[b] = maxLL;
                RngLow[b] = maxLL - boxSizePoints * Point;
            }
    
            console.log("Quick Init - RngHigh:", RngHigh);
            console.log("Quick Init - RngLow:", RngLow);
        }
    
        const theBoxSize = convertPointsToDigits(boxSizePoints, C);
    
        if (!isNaN(theBoxSize)) {
            console.log("theBoxSize:", theBoxSize);
    
            for (let b = 0; b < numBoxes; b++) {
                if (RngSize[b] < theBoxSize) {
                    if (C > RngHigh[b]) {
                        RngHigh[b] = C;
                    } else if (C < RngLow[b]) {
                        RngLow[b] = C;
                    }
                    continue;
                }
    
                if (C > RngHigh[b]) {
                    RngHigh[b] = C;
                    RngLow[b] = RngHigh[b] - theBoxSize;
                    BoxMovedUp[b] = true;
                    BoxMovedDn[b] = false;
                } else if (C < RngLow[b]) {
                    RngLow[b] = C;
                    RngHigh[b] = RngLow[b] + theBoxSize;
                    BoxMovedUp[b] = false;
                    BoxMovedDn[b] = true;
                }
    
                console.log(`Box ${b} - RngHigh: ${RngHigh}, RngLow: ${RngLow}`);
            }
        }
    };
    
    
    

    return (
        <div className='w-full pl-10 pr-10 pt-2 pb-2 bg-black text-sm space-y-1 font-mono text-gray-200'>
            <div><span className='text-gray-400 font-bold'>Current Close Price:</span> {currentClosePrice}</div>
            <div><span className='text-gray-400 font-bold'>Lowest Index:</span> {lowestIndex}</div>
            <div><span className='text-gray-400 font-bold'>Highest Index:</span> {highestIndex}</div>
          
            <div><span className='text-gray-400 font-bold'>Current Price vs Prev Price:</span> {currentDirection}</div>
            <div><span className='text-gray-400 font-bold'>Box Direction:</span>
                <ul>
                    {boxArray.map((box, index) => (
                        <li key={index}>
                            Box {index + 1}: {box.boxMovedUp ? "UP" : box.boxMovedDn ? "DOWN" : "STABLE"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default BoxChart;
