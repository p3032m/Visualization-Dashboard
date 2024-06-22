import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    // Extract data from object format to array of objects
    const dataset = Object.keys(data).map(key => ({ topic: key, frequency: data[key] }));

    // Sort dataset by frequency descending
    dataset.sort((a, b) => b.frequency - a.frequency);

    // Take top 4 topics and sum up the rest under "Other"
    const top4Topics = dataset.slice(0, 4);
    const otherCount = d3.sum(dataset.slice(4), d => d.frequency);

    if (otherCount > 0) {
      top4Topics.push({ topic: 'Other', frequency: otherCount });
    }

    // Set up D3 chart
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);

    const x = d3.scaleBand()
      .domain(top4Topics.map(d => d.topic))
      .range([margin.left, innerWidth + margin.left])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(top4Topics, d => d.frequency)])
      .nice()
      .range([innerHeight + margin.top, margin.top]);

    const line = d3.line()
      .x(d => x(d.topic) + x.bandwidth() / 2)
      .y(d => y(d.frequency))
      .curve(d3.curveCatmullRom);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.select('.x-axis')
      .attr('transform', `translate(0, ${innerHeight + margin.top})`)
      .call(xAxis);

    svg.select('.y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    svg.select('.line')
      .datum(top4Topics)
      .attr('fill', 'none')
      .attr('stroke', 'green') // Change line color to green
      .attr('stroke-width', 2)
      .attr('d', line);

  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="x-axis" />
      <g className="y-axis" />
      <path className="line" />
    </svg>
  );
};

export default LineChart;
