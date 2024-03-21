"use client";
import { CandleData } from "@/types";
import React, { useEffect, useState } from "react";

interface S5ChartProps {
    s5Candles: CandleData[];
}

const S5Chart: React.FC<S5ChartProps> = ({ s5Candles }) => {
    const [closingPrices, setClosingPrices] = useState<number[]>([]);
    const [pathData, setPathData] = useState<string>("");

    useEffect(() => {
        const newClosingPrices = s5Candles.map((candle) =>
            parseFloat(candle.ask.c),
        );
        setClosingPrices(newClosingPrices);

        const newPathData = newClosingPrices
            .map((price, index) => {
                const x = (index / (newClosingPrices.length - 1)) * 1600;
                const y =
                    400 -
                    ((price - Math.min(...newClosingPrices)) /
                        (Math.max(...newClosingPrices) -
                            Math.min(...newClosingPrices))) *
                        400;
                return `${x.toFixed(3)},${y.toFixed(2)}`;
            })
            .join(" L ");

        setPathData(`M 0,400 L ${newPathData} L 1600,400`);
    }, [s5Candles]);

    useEffect(() => {
        const timer = setInterval(() => {
            const newClosingPrices = s5Candles.map((candle) =>
                parseFloat(candle.ask.c),
            );
            setClosingPrices(newClosingPrices);

            const newPathData = newClosingPrices
                .map((price, index) => {
                    const x = (index / (newClosingPrices.length - 1)) * 1600;
                    const y =
                        400 -
                        ((price - Math.min(...newClosingPrices)) /
                            (Math.max(...newClosingPrices) -
                                Math.min(...newClosingPrices))) *
                            400;
                    return `${x.toFixed(3)},${y.toFixed(2)}`;
                })
                .join(" L ");

            setPathData(`M 0,400 L ${newPathData} L 1600,400`);
        }, 5000);

        return () => clearInterval(timer);
    }, [s5Candles]);

    return (
        <div className="h-[400px] w-full">
            <svg width="1600" height="400" viewBox="0 0 1600 400">
                <title>Line Chart</title>

                {/* X-axis */}
                <line
                    x1="0"
                    y1="400"
                    x2="1600"
                    y2="400"
                    stroke="#555"
                    strokeWidth="3"
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
                        d={pathData}
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                    />
                </g>
            </svg>
        </div>
    );
};

export default S5Chart;
