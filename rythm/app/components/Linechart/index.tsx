import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CandleData } from '@/types';
import styles from './styles.module.css';

const CHART_DIMENSIONS = {
  width: 800,
  height: 600,
  margin: {
    top: 20,
    right: 50,
    bottom: 20,
    left: 50,
  },
};

const LIGHT_THEME = {
  axisColor: "#333333",
  textColor: "#888888",
  bearColor: "#888888",
  bullColor: "#888888",
  lineColor: "#999999"
};

const LineChart: React.FC<{ data: CandleData[] }> = ({ data }) => {
  const chartAreaRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    let container = d3.select(containerRef.current);

    const { width, height, margin } = CHART_DIMENSIONS;

    let x = d3.scaleBand().rangeRound([margin.left, width - margin.right]).padding(0.2);
    let y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

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

    const svg = d3.select(svgRef.current);
    const handleZoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
          d3.select(chartAreaRef.current).attr("transform", event.transform);
        });

    svg.call(handleZoom);
    container.selectAll('*').remove();

    container.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat((d) => {
        const value = d as number;
        if (Math.abs(value) >= 100) {
          return d3.format(".4s")(value);
        }
        return d3.format(".5f")(value);
      }))
      .selectAll("text")
      .attr("fill", LIGHT_THEME.textColor);

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
    <div className={styles.chartWrapper}>
      <svg ref={svgRef} width={CHART_DIMENSIONS.width} height={CHART_DIMENSIONS.height}>
        <g ref={containerRef}>
          <g ref={chartAreaRef}></g>  
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
