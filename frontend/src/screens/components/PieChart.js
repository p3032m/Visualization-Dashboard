import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    // Extract data from object format to array of objects
    const dataset = Object.keys(data).map(key => ({ likelihood: key, count: data[key] }));

    // Sort dataset by count descending
    dataset.sort((a, b) => b.count - a.count);

    // Take top 5 likelihoods and sum up the rest under "Other"
    const top5Likelihoods = dataset.slice(0, 5);
    const otherCount = d3.sum(dataset.slice(5), d => d.count);

    if (otherCount > 0) {
      top5Likelihoods.push({ likelihood: 'Other', count: otherCount });
    }

    // Set up D3 pie chart
    const radius = Math.min(width, height) / 2;
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateCool) // Use a cool color gradient
      .domain([0, top5Likelihoods.length]);

    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const svg = d3.select(svgRef.current);

    const arcs = svg.selectAll('.arc')
      .data(pie(top5Likelihoods))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(i))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data.likelihood)
      .style('fill', 'black')
      .style('font-size', '12px');

  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}>
    </svg>
  );
};

export default PieChart;
