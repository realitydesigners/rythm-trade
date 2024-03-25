import { RangeLineProps } from "@/types";
import React from "react";

const RangeLines: React.FC<RangeLineProps> = ({ boxArrays, minY, maxY }) => {
    if (!boxArrays) return null;

    const filteredBoxArrays = Object.fromEntries(
        Object.entries(boxArrays).filter(([key]) =>
            [
                "10",
                "20",
                "30",
                "40",
                "50",
                "60",
                "70",
                "80",
                "90",
                "100",
            ].includes(key as string),
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
                                High ({boxKey}): {high.toFixed(2)}
                            </text>
                            <text
                                x="100"
                                y={(410 - lowY).toFixed(2)}
                                dominantBaseline="middle"
                                fill={textColor}
                                fontSize="12px"
                            >
                                Low ({boxKey}): {low.toFixed(2)}
                            </text>
                        </g>
                    );
                },
            )}
        </>
    );
};

export default RangeLines;
