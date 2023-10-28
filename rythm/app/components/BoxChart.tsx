"use client"


// 1. loop through the data to find the highest high and lowest low
// 2. if the range is greater than or equal to the box size, then we have a box



import React, { useState, useEffect } from 'react';
import { CandleData, StreamData } from '../../types';
import { startStreaming, fetchData } from '../api/getData';
import { findHighestHighIndex, findLowestLowIndex } from '../api/priceAnalysis';

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
    const [currentClosePrice, setCurrentClosePrice] = useState<number>(0);
    const [currentDirection, setCurrentDirection] = useState<string | null>(null);
    const [boxArray, setBoxArray] = useState<Box[]>([]);
    const [initializationComplete, setInitializationComplete] = useState<boolean>(false);

    const [lowestIndex, setLowestIndex] = useState<number | null>(null);
    const [highestIndex, setHighestIndex] = useState<number | null>(null);
    
    const defaultBoxSize = 10;

    useEffect(() => {
        const initializeData = async (): Promise<void> => {
            const oandaData: CandleData[] = await fetchData();
            console.log("Fetched oandaData:", oandaData);

            if (oandaData && oandaData.length > 1) {
                setCurrentClosePrice(parseFloat(oandaData[0].mid.c));

                const highestHighIdx = findHighestHighIndex(oandaData, 0, oandaData.length - 1);
                const lowestLowIdx = findLowestLowIndex(oandaData, 0, oandaData.length - 1);

                setHighestIndex(highestHighIdx);
                setLowestIndex(lowestLowIdx);
                

                const currentPrice = parseFloat(oandaData[0].mid.c);
                const previousPrice = parseFloat(oandaData[1].mid.c);
                setCurrentDirection(currentPrice > previousPrice ? 'UP' : 'DOWN');

                const newBoxArray: Box[] = [...boxArray];
                for (let index = 0; index < 100; index++) {
                    const newBox = calculateBox(index, defaultBoxSize, oandaData);
                    newBoxArray[index] = newBox;
                }
                setBoxArray(newBoxArray);
                setInitializationComplete(true);
            }
        };

        initializeData();

        const onDataReceived = (data: StreamData) => {
            setCurrentClosePrice(data.price);
        };

        startStreaming(ACCOUNT_ID, INSTRUMENT, OANDA_TOKEN, onDataReceived);
    }, []);

    const calculateBox = (boxIndex: number, boxSize: number, oandaData: CandleData[]): Box => {


        let currentBox: Box = boxArray[boxIndex];
        if (!currentBox) {
            currentBox = { high: 0, low: 0, boxMovedUp: false, boxMovedDn: false, rngSize: 0 };
        }

        if (boxSize === 0) return currentBox;

        if (!initializationComplete) {
            let HH, LL, RNG, nHH, nLL, HH1, LL1, RNG1, nHH1, nLL1;
            const findHighestHigh = (data: CandleData[], start: number, end: number) => {
                let highestIndex = start;
                for (let i = start; i <= end; i++) {
                    if (parseFloat(data[i].mid.c) > parseFloat(data[highestIndex].mid.c)) {
                        highestIndex = i;
                    }
                }
                return highestIndex;
            };

            const findLowestLow = (data: CandleData[], start: number, end: number) => {
                let lowestIndex = start;
                for (let i = start; i <= end; i++) {
                    if (parseFloat(data[i].mid.c) < parseFloat(data[lowestIndex].mid.c)) {
                        lowestIndex = i;
                    }
                }
           
                return lowestIndex;
                
            };

            for (let w = 0; w < oandaData.length; w++) {
                nHH = findHighestHigh(oandaData, 0, w + 1);
                HH = parseFloat(oandaData[nHH].mid.c);

                nLL = findLowestLow(oandaData, 0, w + 1);
                LL = parseFloat(oandaData[nLL].mid.c);

                RNG = HH - LL;
                if (RNG >= boxSize) break;
               
            }

            const maxInitialValues = Math.max(nHH || 0, nLL || 0);

            for (let w = 0; w < oandaData.length; w++) {
                nHH1 = findHighestHigh(oandaData, w + 1, maxInitialValues);
                HH1 = parseFloat(oandaData[nHH1].mid.c);

                nLL1 = findLowestLow(oandaData, w + 1, maxInitialValues);
                LL1 = parseFloat(oandaData[nLL1].mid.c);

                RNG1 = HH1 - LL1;
                if (RNG1 >= boxSize) break;
            }

            if (HH !== undefined && HH1 !== undefined && LL !== undefined) {
                currentBox = HH > HH1
                    ? { ...currentBox, high: HH, low: HH - boxSize, boxMovedUp: true, boxMovedDn: false, rngSize: boxSize }
                    : { ...currentBox, low: LL, high: LL + boxSize, boxMovedUp: false, boxMovedDn: true, rngSize: boxSize };

                    console.log("Highest Price:", HH);
console.log("Lowest Price:", LL);

            }
            


        }

        // ... the rest of your existing logic after initialization ...

        return currentBox;
    };
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