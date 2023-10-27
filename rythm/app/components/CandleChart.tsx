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

    const svgSelection = d3.select(svgRef.current).style("background-color", "black");
    let container = d3.select(containerRef.current);

    const { width, height, margin } = CHART_DIMENSIONS;

    let x = d3.scaleBand().rangeRound([margin.left, width - margin.right]).padding(0.2);
    let y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

    const svgElement = svgRef.current;
    const containerElement = containerRef.current;

    if (!svgElement || !containerElement) return;

    x.domain(data.map(d => d.time));
    y.domain([
      d3.min(data, d => parseFloat(d.mid.l))! * 0.99,
      d3.max(data, d => parseFloat(d.mid.h))! * 1.01,
    ]);

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
    
    candles.append("rect")
    .attr("x", d => x(d.time) || 0)
    .attr("y", d => y(Math.max(parseFloat(d.mid.o), parseFloat(d.mid.c))))
    .attr("width", x.bandwidth())
    .attr("height", d => y(Math.min(parseFloat(d.mid.o), parseFloat(d.mid.c))) - y(Math.max(parseFloat(d.mid.o), parseFloat(d.mid.c))))
    .attr("fill", getColor);

  candles.append("line")
    .attr("x1", d => (x(d.time) || 0) + x.bandwidth() / 2)
    .attr("x2", d => (x(d.time) || 0) + x.bandwidth() / 2)
    .attr("y1", d => y(parseFloat(d.mid.h)))
    .attr("y2", d => y(parseFloat(d.mid.l)))
    .attr("stroke", LIGHT_THEME.lineColor);
}, [data]);

  return (
    <svg ref={svgRef} width={CHART_DIMENSIONS.width} height={CHART_DIMENSIONS.height}>
      <g ref={containerRef}></g>
    </svg>
  );
};

export default CandleChart;