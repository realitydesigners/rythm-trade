"use client";
import { CandleData } from "@/types";
import React, { useEffect, useState } from "react";

interface S5ChartProps {
    s5Candles: CandleData[];
    streamingData: any | null;
    boxArrays?: {
        [key: string]: {
            high: number;
            low: number;
            boxMovedDn: boolean;
            boxMovedUp: boolean;
        };
    };
}

interface LineProps {
    closingPrices: number[];
    minY: number;
    maxY: number;
    streamingData?: number | null;
}

const S5StreamChart: React.FC<S5ChartProps> = ({
    s5Candles,
    streamingData,
    boxArrays,
}) => {
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

        const bidPrice = parseFloat(streamingData.closeoutBid);
        if (!Number.isNaN(bidPrice)) {
            setClosingPrices((prevPrices) => [...prevPrices, bidPrice]);
            if (closingPrices.length > 300) {
                setClosingPrices((prevPrices) => prevPrices.slice(-300)); // Keep only the latest 300 prices
            }
        }
    }, [streamingData]); // Depend on streamingData to update when it changes

    if (closingPrices.length === 0) {
        return <div>Loading...</div>;
    }

    const minY = Math.min(...closingPrices);
    const maxY = Math.max(...closingPrices);

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
                <Line
                    closingPrices={closingPrices}
                    minY={minY}
                    maxY={maxY}
                    streamingData={streamingData}
                />
                <HighAndLow boxArrays={boxArrays} minY={minY} maxY={maxY} />
            </svg>
        </div>
    );
};

const Line: React.FC<LineProps> = ({
    closingPrices,
    minY,
    maxY,
    streamingData,
}) => {
    const pathData = closingPrices
        .map((price, index) => {
            const x = (index / (closingPrices.length - 1)) * 1600; // Assuming 1600 is the chartWidth
            const y = 400 - ((price - minY) / (maxY - minY)) * 400;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" L ");

    return (
        <g>
            {/* Main line chart */}
            <path
                d={`M 0,400 L ${pathData} L 1600,400`}
                fill="none"
                stroke="white"
                strokeWidth="2"
            />

            {/* Current data line with price label */}
            {typeof streamingData === "number" &&
                !Number.isNaN(streamingData) && (
                    <>
                        <line
                            x1="0"
                            y1={(
                                400 -
                                ((streamingData - minY) / (maxY - minY)) * 400
                            ).toFixed(2)}
                            x2="1600"
                            y2={(
                                400 -
                                ((streamingData - minY) / (maxY - minY)) * 400
                            ).toFixed(2)}
                            stroke="#555"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                        {/* Price label for current data */}
                        <text
                            x="1000"
                            y={(
                                400 -
                                ((streamingData - minY) / (maxY - minY)) * 420
                            ).toFixed(2)}
                            dominantBaseline="middle"
                            fill="#555"
                            fontSize="14px"
                        >
                            Current: {streamingData.toFixed(2)}
                        </text>
                    </>
                )}
        </g>
    );
};

interface HighAndLowProps {
    boxArrays?: {
        [key: string]: {
            high: number;
            low: number;
            boxMovedDn: boolean;
            boxMovedUp: boolean;
        };
    };
    minY: number;
    maxY: number;
}
const HighAndLow: React.FC<HighAndLowProps> = ({ boxArrays, minY, maxY }) => {
    if (!boxArrays) return null;

    const filteredBoxArrays = Object.fromEntries(
        Object.entries(boxArrays).filter(([key]) =>
            ["10", "20", "30", "40", "50", "60", "70"].includes(key),
        ),
    );

    return (
        <>
            {Object.entries(filteredBoxArrays).map(
                ([boxKey, { high, low, boxMovedDn, boxMovedUp }]) => {
                    const highY = ((high - minY) / (maxY - minY)) * 400;
                    const lowY = ((low - minY) / (maxY - minY)) * 400;
                    const directionLabel = boxMovedDn
                        ? "D"
                        : boxMovedUp
                          ? "U"
                          : "";
                    const lineColor =
                        directionLabel === "U" ? "#59cfc3" : "#CF596E";
                    const textColor =
                        directionLabel === "U" ? "#59cfc3" : "#CF596E";

                    return (
                        <g key={boxKey}>
                            {/* High Line */}
                            <line
                                x1="0"
                                y1={(400 - highY).toFixed(2)}
                                x2="1600"
                                y2={(400 - highY).toFixed(2)}
                                stroke={lineColor}
                                strokeWidth="2"
                            />
                            {/* Low Line */}
                            <line
                                x1="0"
                                y1={(400 - lowY).toFixed(2)}
                                x2="1600"
                                y2={(400 - lowY).toFixed(2)}
                                stroke={lineColor}
                                strokeWidth="1"
                            />
                            {/* Price labels for high and low with direction indicator */}
                            <text
                                x="1000"
                                y={(390 - highY).toFixed(2)}
                                dominantBaseline="middle"
                                fill={textColor}
                                fontSize="12px"
                            >
                                {boxKey} {high.toFixed(2)}
                            </text>
                            <text
                                x="1000"
                                y={(410 - lowY).toFixed(2)}
                                dominantBaseline="middle"
                                fill={textColor}
                                fontSize="12px"
                            >
                                {boxKey}: {low.toFixed(2)}
                            </text>
                        </g>
                    );
                },
            )}
        </>
    );
};

export default S5StreamChart;
