// BoxesModel Component: Displays boxes representing price ranges for a given currency pair.
// The boxes are calculated based on historical candle data fetched from Oanda API.
// Each box represents a specific range of prices and is updated based on new candle data.

"use client";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import styles from './styles.module.css';
import { CandleData, Box, BoxArrays } from '../../../types';
import { findCurrentPrice, findHighest, findLowest } from '../../api/priceAnalysis';
import { OandaApiContext } from '../../api/OandaApi';
import { SymbolsToDigits, symbolsToDigits, BOX_SIZES } from '../../utils/constants';
import BoxChart from '../BoxChart';
import ResoBox from '../ResoBox';

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
    const [selectedBoxArray, setSelectedBoxArray] = useState<string>('default');

    // Function to switch between arrays
    const switchBoxArray = (arrayKey: string) => {
        if (selectedBoxArray === arrayKey) {
            // Do nothing if the selected array is already active
            return;
        }
        setInitializationComplete(false);
        setSelectedBoxArray(arrayKey);
    };

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
        let intervalId: NodeJS.Timeout;

        const fetchAndCalculateBoxes = async () => {
            const oandaData = await api?.fetchLargeCandles(pair, 6000, 'M1');
            if (oandaData && oandaData.length > 0) {
                const currentPrice = findCurrentPrice(oandaData);
                if (currentPrice !== undefined) {
                    const boxSizes = generateBoxSizes(pair, BOX_SIZES[selectedBoxArray], symbolsToDigits);
                    calculateAllBoxes(currentPrice, oandaData, boxSizes);
                }
            } else {
                console.log("No valid data received.");
            }
        };

        fetchAndCalculateBoxes();
        intervalId = setInterval(fetchAndCalculateBoxes, 60000);

        return () => clearInterval(intervalId);
    }, [pair, selectedBoxArray]);
    

    // Render
    if (!initializationComplete) {
        return (
            <div className={styles.loadingContainer}>
                Loading...
            </div>
        );
    }

    /* Modify renderToggleButtons function to apply active class */
    const renderToggleButtons = () => {
        return (
            <div className={styles.buttonContainer}>
                <button onClick={() => switchBoxArray('default')} 
                        className={`${styles.toggleButton} ${selectedBoxArray === 'default' ? styles.active : ''}`}>
                    MysticRex
                </button>
                <button onClick={() => switchBoxArray('array1')} 
                        className={`${styles.toggleButton} ${selectedBoxArray === 'array1' ? styles.active : ''}`}>
                    SpiritBronto
                </button>
                <button onClick={() => switchBoxArray('array2')} 
                        className={`${styles.toggleButton} ${selectedBoxArray === 'array2' ? styles.active : ''}`}>
                    ZenSaur
                </button>
                <button onClick={() => switchBoxArray('array3')} 
                        className={`${styles.toggleButton} ${selectedBoxArray === 'array3' ? styles.active : ''}`}>
                    AuraRaptor
                </button>
            </div>
        );
    };

    // Render: Displays the current close price and a list of boxes with their respective sizes and states. 
    return (
        <div className={styles.container}>
            {initializationComplete ? (
                <>
                    <BoxChart boxArrays={boxArrays} />
                    <ResoBox boxArrays={boxArrays} />
                    {renderToggleButtons()}
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
                </>
            ) : (
                <div className={styles.loadingContainer}>Loading...</div>
            )}
        </div>
    );
};

export default BoxesModel;