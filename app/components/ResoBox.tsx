"use client";
import * as d3 from "d3";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BoxArrays } from "../../types";

interface BoxChartProps {
	boxArrays: BoxArrays;
}

const ResoBox: React.FC<BoxChartProps> = ({ boxArrays }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [containerWidth, setContainerWidth] = useState<number>(100);

	const drawNestedBoxes = (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		data: any[],
		svg: d3.Selection<SVGGElement, unknown, null, undefined>,
		size: number,
	) => {
		let currentX = 0;
		let currentY = 0;
		let corner = 0;

		if (data.length === 0 || !("size" in data[0])) {
			console.error("Data is empty or missing 'size' property");
			return; // Exit the function if data is invalid
		}

		const sortedData = data.sort((a, b) => b.size - a.size);
		const scaleFactor = size / sortedData[0].size;
		const maxOverlayOpacity = 0.9; // Maximum white overlay opacity for the last box
		const minOverlayOpacity = 0.1; // Minimum white overlay opacity for the first box after the color transition

		// Apply a background color to the entire chart area that matches the last box's overlay
		// to create a smooth gradient effect across all boxes.
		svg
			.append("rect")
			.attr("width", size)
			.attr("height", size)
			.attr("fill", "rgba(#ffffff)")
			.attr("fill-opacity", maxOverlayOpacity);

		// biome-ignore lint/complexity/noForEach: <explanation>
		sortedData.forEach((d, index) => {
			// Set the base color based on whether the box moved up or down.
			const fill = d.boxMovedUp ? "#59cfc3" : "#CF596E";

			// Add the base color box.
			svg
				.append("rect")
				.attr("x", currentX)
				.attr("y", currentY)
				.attr("width", d.size * scaleFactor)
				.attr("height", d.size * scaleFactor)
				.attr("fill", fill)
				.attr("fill-opacity", 1); // Base color is fully opaque.

			// Overlay white boxes start with minimum opacity and increase with each subsequent box.
			// biome-ignore lint/style/useConst: <explanation>
			let overlayOpacity =
				minOverlayOpacity +
				(maxOverlayOpacity - minOverlayOpacity) *
					(index / (sortedData.length - 1));

			// Add the white overlay box.
			svg
				.append("rect")
				.attr("x", currentX)
				.attr("y", currentY)
				.attr("width", d.size * scaleFactor)
				.attr("height", d.size * scaleFactor)
				.attr("fill", "rgba(0,0,0,0.8)")
				.attr("fill-opacity", overlayOpacity);

			// Determine the position for the next box.
			if (d.boxMovedUp) {
				corner = 1;
			} else if (d.boxMovedDn) {
				corner = 2;
			}

			if (index < sortedData.length - 1) {
				const nextBox = sortedData[index + 1];
				switch (corner) {
					case 1:
						currentX += d.size * scaleFactor - nextBox.size * scaleFactor;
						break;
					case 2:
						currentX += d.size * scaleFactor - nextBox.size * scaleFactor;
						currentY += d.size * scaleFactor - nextBox.size * scaleFactor;
						break;
				}
			}
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const drawChart = useCallback(() => {
		if (!svgRef.current) return;

		d3.select(svgRef.current).selectAll("*").remove();

		const padding = 20; // Adjust this value for desired padding
		const size = containerWidth - padding * 1; // Subtract padding from both sides
		const svg = d3
			.select(svgRef.current)
			.attr("width", size + padding * 1)
			.attr("height", size + padding * 1)
			.append("g")
			.attr("transform", `translate(${padding}, ${padding})`); // Translate the g element by the padding amount

		const data = Object.entries(boxArrays)
			.map(([size, box]) => ({
				size: parseInt(size),
				high: box.high,
				low: box.low,
				boxMovedUp: box.boxMovedUp,
				boxMovedDn: box.boxMovedDn,
			}))
			.sort((a, b) => b.size - a.size);

		drawNestedBoxes(data, svg, size);
	}, [boxArrays, containerWidth]);

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

	useEffect(() => {
		drawChart();
	}, [drawChart]);

	return (
		<div ref={containerRef} className="relative flex h-full w-full pb-6 ">
			<svg ref={svgRef} />
		</div>
	);
};

export default ResoBox;
