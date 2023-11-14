"use client"
// BoxModel/index.tsx
import React, { useState, useEffect, useContext } from 'react';
import styles from './styles.module.css';
import { CandleData, Box } from '../../../types';
import { findCurrentPrice, findHighest, findLowest } from '../../api/priceAnalysis';
import { OandaApiContext } from '../../api/OandaApi';
import { symbolsToDigits } from '../../utils/constants'; 
interface BoxModelProps {
    pair: string;
} 
const BoxModel: React.FC<BoxModelProps> = ({ pair }) => {
    const api = useContext(OandaApiContext);
    
    const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(null);
    const [currentDirection, setCurrentDirection] = useState<string | null>(null);
    const [boxArray, setBoxArray] = useState<Box[]>([]);
    const [initializationComplete, setInitializationComplete] = useState<boolean>(false);
    const [lowestIndex, setLowestIndex] = useState<number | null>(null);
    const [highestIndex, setHighestIndex] = useState<number | null>(null);

    const numBoxes = 5;
    const boxSizePoints = 100.0;

    const BoxMovedUp = new Array(numBoxes).fill(false);
    const BoxMovedDn = new Array(numBoxes).fill(false);
    const RngHigh = new Array(numBoxes).fill(null);
    const RngLow = new Array(numBoxes).fill(null);
    const RngSize = new Array(numBoxes).fill(null);

    let oandaData: CandleData[] = [];
    let Point = .10; 

    useEffect(() => {
        const initializeData = async () => {
            try {
                oandaData = await api?.fetchCandles(pair, 300, 'M1');

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
                        calculateBoxes(currentPrice, boxSizePoints, oandaData, false);
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
    const getPairDetails = (pair: string) => {
        const defaultDetails = { point: 0.0001, digits: 4 };
        return symbolsToDigits[pair] || defaultDetails;
    };

    const calculateBoxes = (C: number, boxSizePoints: number, oandaData: CandleData[], quickInit: boolean) => {
        const { point, digits } = getPairDetails(pair);

        const theBoxSize = boxSizePoints * point;

        if (typeof C === 'undefined' || isNaN(theBoxSize)) {
            return;
        }
        console.log(oandaData)
    
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
    
        const symbol = pair

        if (symbol in symbolsToDigits) {
            const { point, digits } = symbolsToDigits[symbol];

            const theBoxSize = boxSizePoints * Point;
            

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
        } else {
            console.log(`Symbol ${symbol} not found in symbolsToDigits mapping.`);
        }
    };

return (
    <div className={styles.container}>
        <div><span className={styles.title}>Current Close Price:</span> {currentClosePrice}</div>
        <div><span className={styles.title}>Lowest Index:</span> {lowestIndex}</div>
        <div><span className={styles.title}>Highest Index:</span> {highestIndex}</div>
        <div><span className={styles.title}>Current Price vs Prev Price:</span> {currentDirection}</div>
        <div><span className={styles.title}>Box Direction:</span>
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

export default BoxModel;
