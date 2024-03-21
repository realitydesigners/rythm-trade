"use client";
import React, { useEffect, useState } from "react";

interface Candle {
    ask: { c: string };
    bid: { c: string };
    mid: { c: string };
    time: string;
    volume: number;
}

interface S5ChartProps {
    s5Candles: Candle[];
}

const SecondChart: React.FC<S5ChartProps> = ({ s5Candles }) => {
    const [closingPrices, setClosingPrices] = useState<number[]>([]);

    useEffect(() => {
        if (s5Candles.length === 0) {
            console.log("Invalid S5 candles data:", s5Candles);
            return;
        }

        const newClosingPrices = s5Candles.map((candle) =>
            parseFloat(candle.ask.c),
        );
        console.log("Closing prices:", newClosingPrices);

        setClosingPrices(newClosingPrices);
    }, [s5Candles]);

    if (closingPrices.length === 0) {
        return <div>Loading...</div>;
    }

    const minY = Math.min(...closingPrices);
    const maxY = Math.max(...closingPrices);

    console.log("minY:", minY);
    console.log("maxY:", maxY);

    const pathData = closingPrices
        .map((price, index) => {
            const x = (index / (closingPrices.length - 1)) * 1200; // Assuming 1200 is the chartWidth
            const y = 400 - ((price - minY) / (maxY - minY)) * 400;
            return `${x.toFixed(3)},${y.toFixed(2)}`;
        })
        .join(" L ");

    console.log("pathData:", pathData);

    return (
        <div className="h-[400px] w-full">
            <svg width="1200" height="400" viewBox="0 0 1200 400">
                <title>Line Chart</title>

                {/* X-axis */}
                <line
                    x1="0"
                    y1="400"
                    x2="1200"
                    y2="400"
                    stroke="#555"
                    strokeWidth="5"
                />

                {/* Y-axis */}
                <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="400"
                    stroke="#555"
                    strokeWidth="5"
                />

                {/* Main line chart */}
                <g>
                    <path
                        d={`M 0,400 L ${pathData} L 1200,400`}
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                    />
                </g>
            </svg>
        </div>
    );
};

export default SecondChart;
