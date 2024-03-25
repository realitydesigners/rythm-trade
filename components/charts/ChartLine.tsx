"use client";
import { ChartLineProps } from "@/types";
import React from "react";

const ChartLine: React.FC<ChartLineProps> = ({
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
            return `${x.toFixed(3)},${y.toFixed(2)}`;
        })
        .join(" L ");

    return (
        <g>
            <path
                d={`M 0,${chartHeight} L ${pathData}`}
                fill="none"
                stroke="white"
                strokeWidth="1"
            />
        </g>
    );
};

export default ChartLine;
