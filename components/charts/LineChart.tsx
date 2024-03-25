"use client";
import { BoxArrays, CandleData } from "@/types";
import React, { useEffect, useState } from "react";
import ChartLine from "./ChartLine";
import RangeLines from "./RangeLines";

const LineChart: React.FC<{
    s5Candles: CandleData[];
    boxArrays?: BoxArrays;
}> = ({ s5Candles, boxArrays }) => {
    const [closingPrices, setClosingPrices] = useState<number[]>([]);
    const [pathData, setPathData] = useState<string>("");

    useEffect(() => {
        const newClosingPrices = s5Candles.map((candle) =>
            parseFloat(candle.ask.c),
        );
        setClosingPrices(newClosingPrices);

        const newPathData = newClosingPrices
            .map((price, index) => {
                const x = (index / (newClosingPrices.length - 1)) * 1200;
                const y =
                    400 -
                    ((price - Math.min(...newClosingPrices)) /
                        (Math.max(...newClosingPrices) -
                            Math.min(...newClosingPrices))) *
                        400;
                return `${x.toFixed(2)},${y.toFixed(2)}`;
            })
            .join(" L ");

        setPathData(`M 0,400 L ${newPathData} L 1200,400`);
    }, [s5Candles]);

    useEffect(() => {
        const timer = setInterval(() => {
            const newClosingPrices = s5Candles.map((candle) =>
                parseFloat(candle.ask.c),
            );
            setClosingPrices(newClosingPrices);

            const newPathData = newClosingPrices
                .map((price, index) => {
                    const x = (index / (newClosingPrices.length - 1)) * 1200;
                    const y =
                        400 -
                        ((price - Math.min(...newClosingPrices)) /
                            (Math.max(...newClosingPrices) -
                                Math.min(...newClosingPrices))) *
                            400;
                    return `${x.toFixed(2)},${y.toFixed(2)}`;
                })
                .join(" L ");

            setPathData(`M 0,400 L ${newPathData} L 1200,400`);
        }, 5000);

        return () => clearInterval(timer);
    }, [s5Candles]);

    if (closingPrices.length === 0) {
        return <div>Loading...</div>;
    }

    const padding = 100;
    const minY = Math.min(...closingPrices);
    const maxY = Math.max(...closingPrices);

    return (
        <div className="h-[400px] w-full">
            <svg width="1200" height="400" viewBox="0 0 1200 400">
                <title>Line Chart</title>
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

export default LineChart;
