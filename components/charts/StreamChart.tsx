"use client";
import { BoxArrays, CandleData, StreamData } from "@/types";
import React, { useEffect, useState } from "react";
import ChartLine from "./ChartLine";
import RangeLines from "./RangeLines";

const StreamChart: React.FC<{
    s5Candles: CandleData[];
    streamingData: StreamData | null;
    boxArrays?: BoxArrays;
}> = ({ s5Candles, streamingData, boxArrays }) => {
    const [closingPrices, setClosingPrices] = useState<number[]>([]);

    useEffect(() => {
        if (s5Candles.length === 0) {
            console.log("Invalid S5 candles data:", s5Candles);
            return;
        }

        const newClosingPrices = s5Candles.map((candle) =>
            parseFloat(candle.ask.c),
        );

        setClosingPrices(newClosingPrices);
    }, [s5Candles]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!streamingData) return;

        const bidPrice = parseFloat(streamingData.closeoutBid || "");
        if (!Number.isNaN(bidPrice)) {
            setClosingPrices((prevPrices) => [...prevPrices, bidPrice]);
            if (closingPrices.length > 1000) {
                setClosingPrices((prevPrices) => prevPrices.slice(-1000));
            }
        }
    }, [streamingData]);

    if (closingPrices.length === 0) {
        return <div>Loading...</div>;
    }

    const padding = 250;
    const minY = Math.min(...closingPrices);
    const maxY = Math.max(...closingPrices);

    return (
        <div className="h-[400px] w-full">
            <svg width="1200" height="400" viewBox="0 0 1200 400">
                <title>Stream Chart</title>
                <RangeLines boxArrays={boxArrays} minY={minY} maxY={maxY} />
                <ChartLine
                    closingPrices={closingPrices}
                    minY={minY}
                    maxY={maxY}
                    padding={padding}
                />
            </svg>
        </div>
    );
};

export default StreamChart;
