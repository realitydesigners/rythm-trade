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
    padding?: number;
}

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
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg width="1200" height="400" viewBox="0 0 1200 400">
                <HighAndLow boxArrays={boxArrays} minY={minY} maxY={maxY} />
                <Line
                    closingPrices={closingPrices}
                    minY={minY}
                    maxY={maxY}
                    streamingData={streamingData}
                    padding={padding}
                />
            </svg>
        </div>
    );
};

const Line: React.FC<LineProps> = ({
    closingPrices,
    minY,
    maxY,

    padding = 0,
}) => {
    const chartWidth = 1200;
    const chartHeight = 400;
    const paddedWidth = chartWidth - padding;
    const pathData = closingPrices
        .map((price, index) => {
            const x = (index / (closingPrices.length - 1)) * paddedWidth;
            const y =
                chartHeight - ((price - minY) / (maxY - minY)) * chartHeight;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" L ");

    return (
        <g>
            <path
                d={`M 0,${chartHeight} L ${pathData} L ${paddedWidth},${chartHeight}`}
                fill="none"
                stroke="white"
                strokeWidth="2"
            />
        </g>
    );
};

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
                    const boxColor =
                        directionLabel === "U" ? "#59cfc3" : "#CF596E";

                    return (
                        <g key={boxKey}>
                            {/* High Line */}
                            <line
                                x1="0"
                                y1={(400 - highY).toFixed(2)}
                                x2="1200"
                                y2={(400 - highY).toFixed(2)}
                                stroke={lineColor}
                                strokeWidth="1"
                            />
                            {/* Low Line */}
                            <line
                                x1="0"
                                y1={(400 - lowY).toFixed(2)}
                                x2="1200"
                                y2={(400 - lowY).toFixed(2)}
                                stroke={lineColor}
                                strokeWidth="1"
                            />
                            {/* Box area */}
                            <rect
                                x="0"
                                y={(400 - highY).toFixed(2)}
                                width="1200"
                                height={(highY - lowY).toFixed(2)}
                                fill={boxColor}
                                fillOpacity="0.05"
                            />
                            {/* Price labels for high and low with direction indicator */}
                            <text
                                x="1000"
                                y={(390 - highY).toFixed(2)}
                                dominantBaseline="middle"
                                fill={textColor}
                                fontSize="12px"
                            >
                                ({boxKey}): {high.toFixed(2)}
                            </text>
                            <text
                                x="100"
                                y={(410 - lowY).toFixed(2)}
                                dominantBaseline="middle"
                                fill={textColor}
                                fontSize="12px"
                            >
                                ({boxKey}): {low.toFixed(2)}
                            </text>
                        </g>
                    );
                },
            )}
        </>
    );
};

export default S5StreamChart;
