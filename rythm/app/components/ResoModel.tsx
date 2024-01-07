'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { BoxArrays, StreamData } from '../../types';
import ResoBox from './ResoBox';
// import { fetchBoxArrays } from '../api/rest';

interface ResoModelProps {
    pair: string;
    streamData: StreamData | null;
    selectedBoxArrayType: string;
}

const ResoModel: React.FC<ResoModelProps> = ({ pair, streamData, selectedBoxArrayType }) => {
    const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(null);
    const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
    const [initializationComplete, setInitializationComplete] = useState<boolean>(false);

    // Fetches box arrays from the backend
    useEffect(() => {
        const fetchAndSetBoxes = async () => {
            try {
                const newBoxArrays = await fetchBoxArrays(pair, selectedBoxArrayType);
                setBoxArrays(newBoxArrays);
                setInitializationComplete(true);
            } catch (error) {
                console.error('Error fetching box arrays:', error);
            }
        };

        fetchAndSetBoxes();
    }, [pair, selectedBoxArrayType]);

    // Updates the current close price from stream data
    useEffect(() => {
        if (streamData) {
            const bidPrice = streamData.bids?.[0]?.price
                ? parseFloat(streamData.bids[0].price)
                : null;
            const askPrice = streamData.asks?.[0]?.price
                ? parseFloat(streamData.asks[0].price)
                : null;

            if (bidPrice !== null && askPrice !== null) {
                const currentPrice = (bidPrice + askPrice) / 2;
                setCurrentClosePrice(currentPrice);
            }
        }
    }, [streamData]);

    // Render
    if (!initializationComplete) {
        return (
            <div className='w-full h-full flex items-center  justify-center'>
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'>
                    <circle
                        cx='25'
                        cy='25'
                        r='20'
                        stroke='#333'
                        strokeWidth='5'
                        fill='none'
                        strokeDasharray='31.415, 31.415'
                        strokeDashoffset='0'
                    >
                        <animateTransform
                            attributeName='transform'
                            type='rotate'
                            from='0 25 25'
                            to='360 25 25'
                            dur='1s'
                            repeatCount='indefinite'
                        />
                    </circle>
                </svg>
            </div>
        );
    }

    return (
        <div className='w-full h-auto text-teal-400 font-bold'>
            <ResoBox boxArrays={boxArrays} />
        </div>
    );
};

export default ResoModel;
