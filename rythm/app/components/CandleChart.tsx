"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { zoom } from 'd3-zoom';

const CHART_DIMENSIONS = {
  width: 800,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50,
  },
};

const LIGHT_THEME = {
    axisColor: "#D1D5DB",   // gray color
    textColor: "#4B5563",   // darker gray color
    bearColor: "#555555",   // gray for bearish candles
    bullColor: "#E5E7EB",   // lighter gray for bullish candles
    lineColor: "#E5E7EB"    // light gray for candle wicks
  };

interface CandleData {
  time: string;
  mid: {
    o: string;
    c: string;
    h: string;
    l: string;
  };
}
const getColor = (d: CandleData) => parseFloat(d.mid.o) > parseFloat(d.mid.c) ? LIGHT_THEME.bearColor : LIGHT_THEME.bullColor;



const CandleChart: React.FC<{ data: CandleData[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<SVGGElement | null>(null);

  

  useEffect(() => {
    if (!svgRef.current) return;

   
    let container = d3.select(containerRef.current);

    const { width, height, margin } = CHART_DIMENSIONS;

    let x = d3.scaleBand().rangeRound([margin.left, width - margin.right]).padding(0.2);
    let y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

    const svgElement = svgRef.current;
    const containerElement = containerRef.current;

    if (!svgElement || !containerElement) return;

    x.domain(data.map(d => d.time));
   // Calculate data range (difference between max and min values)
const dataRange = d3.max(data, d => parseFloat(d.mid.h))! - d3.min(data, d => parseFloat(d.mid.l))!;

// Define a dynamic padding, for example, 5% of the data range
const padding = dataRange * 0.05;

// Update y domain with dynamic padding
y.domain([
  d3.min(data, d => parseFloat(d.mid.l))! - padding,
  d3.max(data, d => parseFloat(d.mid.h))! + padding
]);
;

    const line = d3.line<CandleData>()
  .x(d => (x(d.time) || 0) + x.bandwidth() / 2)  // X position in the middle of the band
  .y(d => y(parseFloat(d.mid.c)))                 // Using closing price for the line


    const svg = d3.select(svgElement) as d3.Selection<SVGSVGElement, unknown, null, undefined>;

    const handleZoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
            container.attr("transform", event.transform);
        });

    svg.call(handleZoom);

    // Clear previous drawings
    container.selectAll('*').remove();

    // Axes
    container.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))
        .selectAll("text")
        .attr("fill", "white");

    container.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(d => (d as number).toFixed(5)))
        .selectAll("text")
        .attr("fill", "white");

    // Candles
    const candles = container.selectAll(".candle").data(data).enter().append("g");
    


    container.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', LIGHT_THEME.lineColor)
    .attr('stroke-width', 1)
    .attr('d', line as any);
}, [data]);

  return (
    <svg ref={svgRef} width={CHART_DIMENSIONS.width} height={CHART_DIMENSIONS.height}>
      <g ref={containerRef}></g>
    </svg>
  );
};

export default CandleChart;