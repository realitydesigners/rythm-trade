// BoxesModel Component: Displays boxes representing price ranges for a given currency pair.
// The boxes are calculated based on historical candle data fetched from Oanda API.
// Each box represents a specific range of prices and is updated based on new candle data.

"use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import styles from './styles.module.css';
import { CandleData, Box, BoxArrays } from '../../../types';
import { findCurrentPrice, findHighest, findLowest } from '../../api/priceAnalysis';
import { OandaApiContext } from '../../api/OandaApi';
import { SymbolsToDigits, symbolsToDigits } from '../../utils/constants';
import BoxChart from '../BoxChart';

interface BoxModelProps {
    pair: string;
}

// generateBoxSizes: Generates a map of box sizes based on the provided point sizes and currency pair. 
const generateBoxSizes = (pair: string, pointSizes: number[], symbolsToDigits: SymbolsToDigits): Map<number, number> => {
    const { point: pointValue } = symbolsToDigits[pair] || { point: 0.00001 };
    let boxSizeMap = new Map<number, number>();
    pointSizes.forEach(size => {
        boxSizeMap.set(size, size * pointValue);
    });
    return boxSizeMap;
};

const BoxesModel: React.FC<BoxModelProps> = ({ pair }) => {
    const api = useContext(OandaApiContext);
    const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(null);
    const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
    const [initializationComplete, setInitializationComplete] = useState<boolean>(false);
    
    // calculateAllBoxes: Calculates the high and low values for each box size based on the candle data. 
    const calculateAllBoxes = useCallback((C: number, oandaData: CandleData[], boxSizeMap: Map<number, number>) => {
        const newBoxArrays: BoxArrays = {};
    
        // Initialize boxes with the last candle's data
        const latestCandle = oandaData[oandaData.length - 1];
        boxSizeMap.forEach((decimalSize, wholeNumberSize) => {
            const latestPrice = parseFloat(latestCandle.mid.c);
            newBoxArrays[wholeNumberSize] = {
                high: latestPrice,
                low: latestPrice - decimalSize,
                boxMovedUp: false,
                boxMovedDn: false,
                rngSize: decimalSize
            };
        });
    
        // Iterate over each candle in reverse to update boxes
        for (let i = oandaData.length - 1; i >= 0; i--) {
            const currentPrice = parseFloat(oandaData[i].mid.c);
    
            boxSizeMap.forEach((decimalSize, wholeNumberSize) => {
                let box = newBoxArrays[wholeNumberSize];
    
                if (currentPrice > box.high) {
                    box.high = currentPrice;
                    box.low = currentPrice - decimalSize;
                    box.boxMovedUp = true;
                    box.boxMovedDn = false;
                } else if (currentPrice < box.low) {
                    box.low = currentPrice;
                    box.high = currentPrice + decimalSize;
                    box.boxMovedUp = false;
                    box.boxMovedDn = true;
                }
    
                newBoxArrays[wholeNumberSize] = box;
            });
        }
    
        setBoxArrays(newBoxArrays);
        if (!initializationComplete) {
            setInitializationComplete(true);
        }
    }, [initializationComplete]);
    
    
    
    // useEffect: Fetches candle data at regular intervals and calculates boxes based on this data. 
    useEffect(() => {
        let intervalId: string | number | NodeJS.Timeout | undefined;

        const fetchAndCalculateBoxes = async () => {
            try {
                const oandaData = await api?.fetchLargeCandles(pair, 6000, 'M1');
                console.log(oandaData)
                if (oandaData && oandaData.length > 0) {
                    const currentPrice = findCurrentPrice(oandaData);
                    if (currentPrice !== undefined) {
                        setCurrentClosePrice(currentPrice);
                        const boxSizes = generateBoxSizes(pair, [
                            1000, 900, 810, 730, 656, 590, 
                            531, 478, 430, 387, 348, 313, 
                            282, 254, 228, 205, 185, 166, 
                            150, 135, 121, 109, 100, 90, 
                            81, 73, 65, 60, 53, 47, 43, 
                            387, 348, 31, 28, 25, 23, 20, 
                            18, 16, 15, 14, 12, 11, 10 
                        ], symbolsToDigits)

                        calculateAllBoxes(currentPrice, oandaData, boxSizes);
                    }
                } else {
                    console.log("No valid data received.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }; 

        fetchAndCalculateBoxes(); 
        intervalId = setInterval(() => {
            fetchAndCalculateBoxes();
        }, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, [pair]);
    

    // Render
    if (!initializationComplete) {
        return (
            <div className={styles.loadingContainer}>
                Loading...
            </div>
        );
    }
    // Render: Displays the current close price and a list of boxes with their respective sizes and states. 
    return (
        <div className={styles.container}>
            <BoxChart boxArrays={boxArrays} />
            <div><span className={styles.title}>Current Close Price:</span> {currentClosePrice}</div>
            <table className={styles.boxTable}>
                <thead>
                    <tr>
                        <th>Box Size</th>
                        <th>Status</th>
                        <th>High</th>
                        <th>Low</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(boxArrays).map(([size, box]) => (
                        <tr key={size}>
                            <td>{size}</td>
                            <td>{box.boxMovedUp ? "UP" : box.boxMovedDn ? "DOWN" : "STABLE"}</td>
                            <td>{box.high}</td>
                            <td>{box.low}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BoxesModel;