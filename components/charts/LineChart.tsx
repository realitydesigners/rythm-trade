import React, { useEffect, useState } from "react";

interface LineChartProps {
    data: any;
    boxArrays?: {
        [key: string]: {
            high: number;
            low: number;
            boxMovedDn: boolean;
            boxMovedUp: boolean;
        };
    };
}

const LineChart: React.FC<LineChartProps> = ({ data, boxArrays }) => {
    const [bidHistory, setBidHistory] = useState<number[]>([]);

    useEffect(() => {
        if (data === null || Number.isNaN(data)) {
            console.log("Invalid data:", data);
            return;
        }

        setBidHistory((prevHistory) => [...prevHistory, data].slice(-500));
    }, [data]);

    const minY = Math.min(...bidHistory);
    const maxY = Math.max(...bidHistory);

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

                <Line
                    bidHistory={bidHistory}
                    minY={minY}
                    maxY={maxY}
                    data={data}
                />

                <HighAndLow boxArrays={boxArrays} minY={minY} maxY={maxY} />
            </svg>
        </div>
    );
};

export default LineChart;

interface LineProps {
    bidHistory: number[];
    minY: number;
    maxY: number;
    data?: number | null;
}

const Line: React.FC<LineProps> = ({ bidHistory, minY, maxY, data }) => {
    const pathData = bidHistory
        .map((price, index) => {
            const x = (index / (bidHistory.length - 1)) * 1200; // Assuming 1200 is the chartWidth
            const y = 400 - ((price - minY) / (maxY - minY)) * 400;
            return `${x.toFixed(3)},${y.toFixed(2)}`;
        })
        .join(" L ");

    return (
        <g>
            {/* Main line chart */}
            <path
                d={`M 0,400 L ${pathData} L 1200,400`}
                fill="none"
                stroke="white"
                strokeWidth="4"
            />

            {/* Current data line with price label */}
            {data !== null && data !== undefined && !Number.isNaN(data) && (
                <>
                    <line
                        x1="0"
                        y1={(
                            400 -
                            ((data - minY) / (maxY - minY)) * 400
                        ).toFixed(3)}
                        x2="1200"
                        y2={(
                            400 -
                            ((data - minY) / (maxY - minY)) * 400
                        ).toFixed(3)}
                        stroke="#555"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                    {/* Price label for current data */}
                    <text
                        x="1000"
                        y={(
                            400 -
                            ((data - minY) / (maxY - minY)) * 420
                        ).toFixed(3)}
                        dominantBaseline="middle"
                        fill="#555"
                        fontSize="14px"
                    >
                        Current: {data.toFixed(3)}
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

    // Filter box arrays for specific keys
    const filteredBoxArrays = Object.fromEntries(
        Object.entries(boxArrays).filter(([key]) =>
            ["30", "40", "50", "60", "70"].includes(key),
        ),
    );
    console.log("filteredBoxArrays", filteredBoxArrays);

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

                    const lineColor = directionLabel === "U" ? "green" : "red";
                    const textColor = directionLabel === "U" ? "green" : "red";

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
                            {/* Price labels for high and low with direction indicator */}
                            <text
                                x="1000"
                                y={(390 - highY).toFixed(2)}
                                dominantBaseline="middle"
                                fill={textColor}
                                fontSize="12px"
                            >
                                High ({boxKey}): {high.toFixed(3)}{" "}
                                {directionLabel}
                            </text>
                            <text
                                x="1000"
                                y={(410 - lowY).toFixed(2)}
                                dominantBaseline="middle"
                                fill={textColor}
                                fontSize="12px"
                            >
                                Low ({boxKey}): {low.toFixed(3)}{" "}
                                {directionLabel}
                            </text>
                        </g>
                    );
                },
            )}
        </>
    );
};
