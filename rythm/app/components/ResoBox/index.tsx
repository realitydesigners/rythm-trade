import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BoxArrays } from '../../../types';
import styles from './styles.module.css';

interface BoxChartProps {
  boxArrays: BoxArrays;
}

const ResoBox: React.FC<BoxChartProps> = ({ boxArrays }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  const drawNestedBoxes = (data: any[], svg: d3.Selection<SVGGElement, unknown, null, undefined>, size: number) => {
    let currentX = 0, currentY = 0;
    let corner = 0;
    let lastBoxMovedUp: boolean | null = null;
  
    const sortedData = data.sort((a, b) => b.size - a.size);
    const scaleFactor = size / sortedData[0].size;
  
    sortedData.forEach((d, index) => {
      svg.append('rect')
        .attr('x', currentX)
        .attr('y', currentY)
        .attr('width', d.size * scaleFactor)
        .attr('height', d.size * scaleFactor)
        .attr('fill', d.boxMovedUp ? "#00FF6E" : d.boxMovedDn ? "pink" : "#6E6E6E")
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
  
      if (index > 0 && lastBoxMovedUp !== null) {
        if ((d.boxMovedUp && !lastBoxMovedUp) || (d.boxMovedDn && lastBoxMovedUp)) {
          corner = (corner + 1) % 4;
        }
      }
  
      lastBoxMovedUp = d.boxMovedUp;
  
      if (index < sortedData.length - 1) {
        const nextBox = sortedData[index + 1];
        switch (corner) {
          case 0:
            break;
          case 1:
            currentX += (d.size * scaleFactor - nextBox.size * scaleFactor);
            break;
          case 2:
            currentX += (d.size * scaleFactor - nextBox.size * scaleFactor);
            currentY += (d.size * scaleFactor - nextBox.size * scaleFactor);
            break;
          case 3:
            currentY += (d.size * scaleFactor - nextBox.size * scaleFactor);
            break;
        }
      }
    });
  };
  
  const drawChart = () => {
    if (!svgRef.current) return;
  
    d3.select(svgRef.current).selectAll("*").remove();
    
    const size = Math.min(containerWidth, 500);
  
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const adjustedSize = size - margin.left - margin.right;
  
    const svg = d3.select(svgRef.current)
      .attr('width', adjustedSize)
      .attr('height', adjustedSize)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const data = Object.entries(boxArrays)
      .map(([size, box]) => ({
        size: parseInt(size),
        high: box.high,
        low: box.low,
        boxMovedUp: box.boxMovedUp,
        boxMovedDn: box.boxMovedDn
      }))
      .sort((a, b) => b.size - a.size);
  
    drawNestedBoxes(data, svg, adjustedSize);
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
    <div ref={containerRef} className={styles.chartContainer}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ResoBox;
