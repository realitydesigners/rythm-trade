import React from 'react';
import styles from './styles.module.css'

interface PriceDetail {
  price: string;
}

interface StreamData {
  bids?: PriceDetail[];
  asks?: PriceDetail[];
}

interface StreamProps {
    pair: string;
    data: StreamData | null;
}

const Stream: React.FC<StreamProps> = ({ pair, data }) => {
    const bid = data?.bids?.[0]?.price ?? 'N/A';
    const ask = data?.asks?.[0]?.price ?? 'N/A';

    return (
        <div className={styles.streamContainer}>
            <div className={styles.priceBox}>
                <p className={styles.pairText}>
                    {pair}: 
                    {data ? (
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
