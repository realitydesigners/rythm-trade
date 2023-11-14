"use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
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
    const [boxArray, setBoxArray] = useState<Box[]>([]);
    const [initializationComplete, setInitializationComplete] = useState<boolean>(false);

    const boxSizePoints = 10.0;
    const numBoxes = 10;
    
    // Dynamically determine point value and digits based on the currency pair. 
    const { point: pointValue, digits } = symbolsToDigits[pair] || { point: 0.0001, digits: 5 };

    // Callback function to calculate the boxes based on the current price and Oanda data. 
    const calculateBoxes = useCallback((C: number, oandaData: CandleData[]) => {
        let newBoxArray: Box[] = [];
        let RngHigh = C;
        let RngLow = C - boxSizePoints * pointValue;
        let BoxMovedUp = false;
        let BoxMovedDn = false;
        let RngSize = RngHigh - RngLow;

        // Initialization logic to set the initial range of the boxes. 
        if (!initializationComplete) { 
            const highestHigh = findHighest(oandaData, 0, oandaData.length - 1) || C;
            const lowestLow = findLowest(oandaData, 0, oandaData.length - 1) || C;
            const RNG = highestHigh - lowestLow;
    
            if (RNG >= boxSizePoints * pointValue) {
                RngHigh = highestHigh;
                RngLow = highestHigh - boxSizePoints * pointValue;
                BoxMovedUp = true;
                BoxMovedDn = false;
            } else {
                RngLow = lowestLow;
                RngHigh = lowestLow + boxSizePoints * pointValue;
                BoxMovedUp = false;
                BoxMovedDn = true;
            }
            RngSize = RngHigh - RngLow;
            setInitializationComplete(true);

        }

        // Update the range and direction of the box based on the current price. 
        if (C > RngHigh) {
            RngHigh = C;
            RngLow = RngHigh - boxSizePoints * pointValue;
            BoxMovedUp = true;
            BoxMovedDn = false;
        } else if (C < RngLow) {
            RngLow = C;
            RngHigh = RngLow + boxSizePoints * pointValue;
            BoxMovedUp = false;
            BoxMovedDn = true;
        }
    
        newBoxArray.push({
            high: RngHigh,
            low: RngLow,
            boxMovedUp: BoxMovedUp,
            boxMovedDn: BoxMovedDn,
            rngSize: RngSize
        });
    
        setBoxArray(newBoxArray);
    }, [initializationComplete, pointValue]);
    

    // Effect to fetch data from the Oanda API and initialize box calculations. 
    useEffect(() => {
        const initializeData = async () => {
            try {
                const oandaData = await api?.fetchCandles(pair, 300, 'M1');
                if (oandaData && oandaData.length > 0) {
                    const currentPrice = findCurrentPrice(oandaData);
                    if (currentPrice !== undefined) {
                        setCurrentClosePrice(currentPrice);
                        calculateBoxes(currentPrice, oandaData);
                    }
                } else {
                    console.log("No valid data received.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        initializeData();
    }, [api, pair, calculateBoxes]);

    return (
        <div className={styles.container}>
            <div><span className={styles.title}>Current Close Price:</span> {currentClosePrice}</div>
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
};

export default BoxModel;
