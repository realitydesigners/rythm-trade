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
    
    const defaultBoxSize = 1;


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
        <div className='w-full pl-10 pr-10 pt-2 pb-2 bg-black text-sm space-y-1 font-mono text-gray-200'>
            <div><span className='text-gray-400 font-bold'>Current Close Price:</span> {currentClosePrice}</div>
            <div><span className='text-gray-400 font-bold'>Lowest Index:</span> {lowestIndex}</div>
            <div><span className='text-gray-400 font-bold'>Highest Index:</span> {highestIndex}</div>
            <div><span className='text-gray-400 font-bold'>Box Size:</span> {defaultBoxSize}</div>
            <div><span className='text-gray-400 font-bold'>Current Price vs Prev Price:</span> {currentDirection}</div>
            <div><span className='text-gray-400 font-bold'>Box Array:</span>
                <ul>
                    {boxArray.map((box, index) => (
                        <li key={index}>
                            <span style={{ fontWeight: 'bold' }}>High:</span> {box.high}, <span style={{ fontWeight: 'bold' }}>Low:</span> {box.low},
                            <span style={{ fontWeight: 'bold' }}>Moved Up:</span> {box.boxMovedUp ? "Yes" : "No"},
                            <span style={{ fontWeight: 'bold' }}>Moved Down:</span> {box.boxMovedDn ? "Yes" : "No"},
                            <span style={{ fontWeight: 'bold' }}>Size:</span> {box.rngSize},
                            <span style={{ fontWeight: 'bold' }}>Direction:</span> {box.boxMovedUp ? "UP" : box.boxMovedDn ? "DOWN" : "STABLE"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
    
}

export default BoxChart;