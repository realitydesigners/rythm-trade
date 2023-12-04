import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BoxArrays } from '../../types';

interface BoxChartProps {
   boxArrays: BoxArrays;
}

const ResoBox: React.FC<BoxChartProps> = ({ boxArrays }) => {
   const svgRef = useRef<SVGSVGElement | null>(null);
   const containerRef = useRef<HTMLDivElement | null>(null);
   const [containerWidth, setContainerWidth] = useState<number>(100);

   const drawNestedBoxes = (data: any[], svg: d3.Selection<SVGGElement, unknown, null, undefined>, size: number) => {
      let currentX = 0,
         currentY = 0;
      let corner = 0;

      const sortedData = data.sort((a, b) => b.size - a.size);
      const scaleFactor = size / sortedData[0].size;
      const maxOverlayOpacity = 0.9; // Maximum white overlay opacity for the last box
      const minOverlayOpacity = 0.1; // Minimum white overlay opacity for the first box after the color transition

      // Apply a background color to the entire chart area that matches the last box's overlay
      // to create a smooth gradient effect across all boxes.
      svg.append('rect').attr('width', size).attr('height', size).attr('fill', 'rgba(0,0,0,0.8)').attr('fill-opacity', maxOverlayOpacity);

      sortedData.forEach((d, index) => {
         // Set the base color based on whether the box moved up or down.
         const fill = d.boxMovedUp ? 'rgb(91,226,186)' : 'rgb(200,100,104)';

         // Add the base color box.
         svg.append('rect')
            .attr('x', currentX)
            .attr('y', currentY)
            .attr('width', d.size * scaleFactor)
            .attr('height', d.size * scaleFactor)
            .attr('fill', fill)
            .attr('fill-opacity', 1); // Base color is fully opaque.

         // Overlay white boxes start with minimum opacity and increase with each subsequent box.
         let overlayOpacity = minOverlayOpacity + (maxOverlayOpacity - minOverlayOpacity) * (index / (sortedData.length - 1));

         // Add the white overlay box.
         svg.append('rect')
            .attr('x', currentX)
            .attr('y', currentY)
            .attr('width', d.size * scaleFactor)
            .attr('height', d.size * scaleFactor)
            .attr('fill', 'rgba(0,0,0,0.8)')
            .attr('fill-opacity', overlayOpacity);

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

   const drawChart = () => {
      if (!svgRef.current) return;

      d3.select(svgRef.current).selectAll('*').remove();

      const size = Math.min(containerWidth, 500);
      const svg = d3.select(svgRef.current).attr('width', size).attr('height', size).append('g');

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
   };

   useEffect(() => {
      const updateWidth = () => {
         if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
         }
      };

      window.addEventListener('resize', updateWidth);
      updateWidth();

      return () => window.removeEventListener('resize', updateWidth);
   }, []);

   useEffect(() => {
      drawChart();
   }, [boxArrays, containerWidth]);

   return (
      <div ref={containerRef} className="w-full flex justify-center">
         <svg ref={svgRef}></svg>
      </div>
   );
};

export default ResoBox;
