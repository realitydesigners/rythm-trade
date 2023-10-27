"use client"
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { zoom } from 'd3-zoom';
import { CandleData } from '@/types';


const CHART_DIMENSIONS = {
  width: 800,
  height: 500,
  margin: {
    top: 20,
    right: 50,
    bottom: 20,
    left: 50,
  },
};

const LIGHT_THEME = {
    axisColor: "#333333",   // gray color
    textColor: "#888888",   // darker gray color
    bearColor: "#888888",   // gray for bearish candles
    bullColor: "#888888",   // lighter gray for bullish candles
    lineColor: "#999999"    // light gray for candle wicks
  };


const CandleChart: React.FC<{ data: CandleData[] }> = ({ data }) => {
  const chartAreaRef = useRef<SVGGElement | null>(null);
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
    const dataRange = d3.max(data, d => parseFloat(d.mid.h))! - d3.min(data, d => parseFloat(d.mid.l))!;
    const padding = dataRange * 0.05;

    y.domain([
      d3.min(data, d => parseFloat(d.mid.l))! - padding,
      d3.max(data, d => parseFloat(d.mid.h))! + padding
    ]);

    const line = d3.line<CandleData>()
      .x(d => (x(d.time) || 0) + x.bandwidth() / 2)
      .y(d => y(parseFloat(d.mid.c)));

    const svg = d3.select(svgElement) as d3.Selection<SVGSVGElement, unknown, null, undefined>;
    const handleZoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
          d3.select(chartAreaRef.current).attr("transform", event.transform);
        });

    svg.call(handleZoom);
    container.selectAll('*').remove();

  

    container.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(d => (d as number).toFixed(5)))
        .selectAll("text")
        .attr("fill", LIGHT_THEME.textColor);


// Horizontal gridlines
container.append("g")
  .attr("class", "grid")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y)
    .tickSize(-(width - margin.left - margin.right))
    .tickFormat(() => "")
  )
  .selectAll("line")
  .attr("stroke", LIGHT_THEME.axisColor);


    d3.select(chartAreaRef.current).selectAll(".candle").data(data).enter().append("g");
    container.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', LIGHT_THEME.lineColor)
      .attr('stroke-width', 1)
      .attr('d', line as any);
  }, [data]);

  return (
    <div className="w-full h-auto bg-gray-800/20  pl-4 pr-4 flex">
      <svg ref={svgRef} width={CHART_DIMENSIONS.width} height={CHART_DIMENSIONS.height}>
        <g ref={containerRef}>
          <g ref={chartAreaRef}></g>  
        </g>
      </svg>
    </div>
  );
};

export default CandleChart;
