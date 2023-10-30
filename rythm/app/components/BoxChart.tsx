"use client"
import React, { useState, useEffect } from 'react';
import { CandleData, StreamData } from '../../types';
import { startStreaming, fetchData } from '../api/getData';
import { findCurrentPrice, findHighest, findLowest } from '../api/priceAnalysis';

import {
    OANDA_BASE_URL,
    OANDA_STREAM_URL,
    OANDA_TOKEN,
    ACCOUNT_ID,
    INSTRUMENT,
} from "../../index";

interface Box {
    high: number;
    low: number;
    boxMovedUp: boolean;
    boxMovedDn: boolean;
    rngSize: number;
}

const BoxChart: React.FC = () => {
    const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(null);

    const [currentDirection, setCurrentDirection] = useState<string | null>(null);
    const [boxArray, setBoxArray] = useState<Box[]>([]);
    const [initializationComplete, setInitializationComplete] = useState<boolean>(false);

    const [lowestIndex, setLowestIndex] = useState<number | null>(null);
    const [highestIndex, setHighestIndex] = useState<number | null>(null);
    
    const defaultBoxSize = 10;


    useEffect(() => {
        const initializeData = async () => {
            try {
                const oandaData: CandleData[] = await fetchData();
    
                if (oandaData && oandaData.length > 0) {
                    const currentPrice = findCurrentPrice(oandaData);
                    if (currentPrice !== undefined) {
                        setCurrentClosePrice(currentPrice);
                    }
    
                    const highestHighIdx = findHighest(oandaData, 0, oandaData.length - 1) || null;
                    const lowestLowIdx = findLowest(oandaData, 0, oandaData.length - 1) || null;
                    console.log("Highest Index:", highestHighIdx);
                    console.log("Lowest Index:", lowestLowIdx);

                    setHighestIndex(highestHighIdx);
                    setLowestIndex(lowestLowIdx);

                    const previousPrice = parseFloat(oandaData[1].mid.c);
                    if (currentPrice !== undefined) {
                        setCurrentDirection(currentPrice > previousPrice ? 'UP' : 'DOWN');
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
    
    
    return (
        <div className='w-full p-8 bg-gray-700/20 text-xs text-gray-200'>
            <div>Current Close Price: {currentClosePrice}</div>
            <div>Lowest Index: {lowestIndex}</div>
            <div>Highest Index: {highestIndex}</div>
            <div>Box Size: {defaultBoxSize}</div>
            <div>Current Direction: {currentDirection}</div>
            <div>Box Array:
                <ul>
                    {boxArray.map((box, index) => (
                        <li key={index}>
                            High: {box.high}, Low: {box.low},
                            Moved Up: {box.boxMovedUp ? "Yes" : "No"},
                            Moved Down: {box.boxMovedDn ? "Yes" : "No"},
                            Size: {box.rngSize},
                            Direction: {box.boxMovedUp ? "UP" : box.boxMovedDn ? "DOWN" : "STABLE"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default BoxChart;