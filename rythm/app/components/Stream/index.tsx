// Stream/index.tsx
import React, { useEffect, useState, useContext } from 'react';
import { ForexData } from '@/types';
import { OandaApiContext } from '../../api/OandaApi';
import styles from './styles.module.css'

interface StreamProps {
    pair: string;
}

const Stream: React.FC<StreamProps> = ({ pair }) => {
    const [prices, setPrices] = useState<ForexData | null>(null);
    const api = useContext(OandaApiContext);

    useEffect(() => {
        if (api) {
            api.startStreaming(pair, (data) => {
                if (data.type === 'PRICE') {
                    setPrices((prevPrices) => ({
                        ...prevPrices,
                        [data.instrument]: {
                            bid: data.bids[0].price,
                            ask: data.asks[0].price,
                        },
                    }));
                }
            });
        }
    }, [api, pair]);

    const priceData = prices && prices[pair];
    const bid = priceData && priceData.bid ? priceData.bid : 'N/A';
    const ask = priceData && priceData.ask ? priceData.ask : 'N/A';

    return (
        <div className={styles.streamContainer}>
            <div className={styles.priceBox}>
                <p className={styles.pairText}>
                    {pair}: 
                    {priceData ? (
                        <>
                            <span className={styles.bidText}> Bid: </span>
                            <span className={styles.pulseText}>{bid}</span>
                            <span className={styles.askText}> Ask: </span>
                            <span className={styles.pulseText}>{ask}</span>
                        </>
                    ) : (
                        <span className={styles.loadingText}>Loading...</span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Stream;
