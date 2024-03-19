import React, { useEffect, useState } from "react";

interface LineChartProps {
    data: any;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const [bidHistory, setBidHistory] = useState<number[]>([]);

    useEffect(() => {
        if (data === null || isNaN(data)) {
            console.log("Invalid data:", data);
            return;
        }

        setBidHistory((prevHistory) => [...prevHistory, data].slice(-500));
    }, [data]);

    useEffect(() => {
        console.log("Bid history:", bidHistory);
    }, [bidHistory]);

    const chartWidth = 800;
    const chartHeight = 200; // Default height

    const minY = Math.min(...bidHistory);
    const maxY = Math.max(...bidHistory);

    const pathData = bidHistory
        .map((price, index) => {
            const x = (index / (bidHistory.length - 1)) * chartWidth;
            const y =
                chartHeight - ((price - minY) / (maxY - minY)) * chartHeight;
            return `${x},${y}`;
        })
        .join(" L ");

    return (
        <svg
            width={chartWidth}
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
            <title>Line Chart</title>

            {/* X-axis */}
            <line
                x1="0"
                y1={chartHeight}
                x2={chartWidth}
                y2={chartHeight}
                stroke="black"
            />

            {/* Y-axis */}
            <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="black" />

            {/* Line chart */}
            {bidHistory.length > 1 && (
                <path
                    d={`M 0,${chartHeight} L ${pathData} L ${chartWidth},${chartHeight}`}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                />
            )}

            {/* Current data line */}
            {data !== null && !isNaN(data) && (
                <line
                    x1="0"
                    y1={
                        chartHeight -
                        ((data - minY) / (maxY - minY)) * chartHeight
                    }
                    x2={chartWidth}
                    y2={
                        chartHeight -
                        ((data - minY) / (maxY - minY)) * chartHeight
                    }
                    stroke="#555"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                />
            )}
        </svg>
    );
};

export default LineChart;
