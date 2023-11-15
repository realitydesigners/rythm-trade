import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BoxArrays } from '../../../types';
import styles from './styles.module.css';

interface BoxChartProps {
    boxArrays: BoxArrays;
}

const BoxChart: React.FC<BoxChartProps> = ({ boxArrays }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    
    useEffect(() => {
        if (!svgRef.current) return;

        const data = Object.entries(boxArrays).map(([size, box]) => ({
            size: parseInt(size),
            high: box.high,
            low: box.low,
            boxMovedUp: box.boxMovedUp,
            boxMovedDn: box.boxMovedDn
        })).sort((a, b) => a.size - b.size); 
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(data.map(d => d.size.toString()));

        const yMax = d3.max(data, d => d.high)!;
        const yMin = d3.min(data, d => d.low)!;

        const y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([height, 0]);

        const xAxis = d3.axisBottom(x);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", d => x(d.size.toString())!)
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.high))
            .attr("height", d => y(d.low) - y(d.high))
            .attr("fill", d => d.boxMovedUp ? "#2E8B57" : d.boxMovedDn ? "pink" : "#69b3a2");
    }, [boxArrays]);

    return (
        <div className={styles.chartContainer}>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default BoxChart;
