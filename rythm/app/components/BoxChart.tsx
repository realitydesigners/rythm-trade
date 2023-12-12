"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { BoxArrays } from "../../types";

interface BoxChartProps {
	boxArrays: BoxArrays;
}

const BoxChart: React.FC<BoxChartProps> = ({ boxArrays }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>(800);

	const drawChart = (width: number) => {
		if (!svgRef.current) return;
		d3.select(svgRef.current).selectAll("*").remove();
		const chartWidth = Math.min(width, 800);
		const margin = { top: 20, right: 10, bottom: 40, left: 10 };
		const adjustedWidth = chartWidth - margin.left - margin.right - 100;
		const height = 500 - margin.top - margin.bottom;

		const data = Object.entries(boxArrays)
			.map(([size, box]) => ({
				size: parseInt(size),
				high: box.high,
				low: box.low,
				boxMovedUp: box.boxMovedUp,
				boxMovedDn: box.boxMovedDn,
			}))
			.sort((a, b) => b.size - a.size);

		const svg = d3
			.select(svgRef.current)
			.attr("width", adjustedWidth)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.range([0, adjustedWidth])
			.padding(0.1)
			.domain(data.map((d) => d.size.toString()));

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const yMax = d3.max(data, (d) => d.high)!;
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const yMin = d3.min(data, (d) => d.low)!;

		const y = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

		const xAxis = d3.axisBottom(x);
		svg
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-65)");

		svg.append("g").call(d3.axisLeft(y));

		svg
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			.attr("x", (d) => x(d.size.toString())!)
			.attr("width", x.bandwidth())
			.attr("y", (d) => y(d.high))
			.attr("height", (d) => y(d.low) - y(d.high))
			.attr("fill", (d) => (d.boxMovedUp ? "#51966F" : "#660050"));
	};

	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.offsetWidth);
			}
		};

		window.addEventListener("resize", updateWidth);
		updateWidth();

		return () => window.removeEventListener("resize", updateWidth);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		drawChart(containerWidth);
	}, [boxArrays, containerWidth]);

	return (
		<div ref={containerRef} className="w-full flex justify-center">
			<svg ref={svgRef} />
		</div>
	);
};

export default BoxChart;
