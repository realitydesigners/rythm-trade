
"use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import styles from './styles.module.css';
import { CandleData, Box, BoxArrays } from '../../../types';
import { findCurrentPrice, findHighest, findLowest } from '../../api/priceAnalysis';
import { OandaApiContext } from '../../api/OandaApi';
import { SymbolsToDigits, symbolsToDigits } from '../../utils/constants';

interface BoxModelProps {
    pair: string;
}

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

    const calculateAllBoxes = useCallback((C: number, oandaData: CandleData[], boxSizeMap: Map<number, number>) => {
        const newBoxArrays: BoxArrays = {};

        boxSizeMap.forEach((decimalSize, wholeNumberSize) => {
            let box: Box = boxArrays[wholeNumberSize] || {
                high: C,
                low: C - decimalSize,
                boxMovedUp: false,
                boxMovedDn: false,
                rngSize: decimalSize
            };

            if (!initializationComplete) {
                // Initialization logic
                const highestHigh = findHighest(oandaData, 0, oandaData.length - 1) || C;
                const lowestLow = findLowest(oandaData, 0, oandaData.length - 1) || C;
                const RNG = highestHigh - lowestLow;

                if (RNG >= decimalSize) {
                    box.high = highestHigh;
                    box.low = highestHigh - decimalSize;
                    box.boxMovedUp = true;
                    box.boxMovedDn = false;
                } else {
                    box.low = lowestLow;
                    box.high = lowestLow + decimalSize;
                    box.boxMovedUp = false;
                    box.boxMovedDn = true;
                }
            } else {
                // Update the existing box based on current price
                if (C > box.high) {
                    box.high = C;
                    box.low = C - decimalSize;
                    box.boxMovedUp = true;
                    box.boxMovedDn = false;
                } else if (C < box.low) {
                    box.low = C;
                    box.high = C + decimalSize;
                    box.boxMovedUp = false;
                    box.boxMovedDn = true;
                }
            }

            box.rngSize = box.high - box.low;
            newBoxArrays[wholeNumberSize] = box;
        });

        setBoxArrays(newBoxArrays);
        if (!initializationComplete) {
            setInitializationComplete(true);
        }
    }, [initializationComplete, boxArrays]);

    useEffect(() => {
        let intervalId: string | number | NodeJS.Timeout | undefined;

        const fetchAndCalculateBoxes = async () => {
            try {
                const oandaData = await api?.fetchCandles(pair, 300, 'M1');
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
    }, [api, pair, calculateAllBoxes]);

    return (
        <div className={styles.container}>
            <div><span className={styles.title}>Current Close Price:</span> {currentClosePrice}</div>
            {Object.entries(boxArrays).map(([size, box]) => (
                <div key={size}>
                    <span className={styles.title}>Box Size: {size}</span>
                    <ul>
                        <li>
                            Box: {box.boxMovedUp ? "UP" : box.boxMovedDn ? "DOWN" : "STABLE"} (High: {box.high}, Low: {box.low})
                        </li>
                    </ul>
                </div>
            ))} 
        </div>
    );
};

export default BoxesModel;