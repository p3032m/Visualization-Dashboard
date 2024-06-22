import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data, width, height }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        // Process data to extract start_year and end_year
        const startYearData = data
            .filter(d => d.start_year && d.start_year <= 2040)
            .map(d => ({ year: d.start_year, type: 'start' }));

        const endYearData = data
            .filter(d => d.end_year && d.end_year <= 2040)
            .map(d => ({ year: d.end_year, type: 'end' }));

        const combinedData = [...startYearData, ...endYearData];

        // Group data by year
        const groupedData = d3.group(combinedData, d => d.year);

        // Prepare data for the lines
        const startYearCounts = Array.from(groupedData, ([year, values]) => ({
            year,
            count: values.filter(v => v.type === 'start').length,
        }));

        const endYearCounts = Array.from(groupedData, ([year, values]) => ({
            year,
            count: values.filter(v => v.type === 'end').length,
        }));

        // Sort the data
        startYearCounts.sort((a, b) => a.year - b.year);
        endYearCounts.sort((a, b) => a.year - b.year);

        // Find the minimum year in the dataset and adjust the starting year
        const minYear = Math.min(
            d3.min(startYearCounts, d => d.year),
            d3.min(endYearCounts, d => d.year)
        );
        const adjustedMinYear = minYear - 2;

        // Remove any previous elements from the chart
        d3.select(chartRef.current).select('*').remove();

        // Create SVG
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([adjustedMinYear, 2040])
            .range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain([0, d3.max([...startYearCounts, ...endYearCounts], d => d.count)])
            .range([innerHeight, 0]);

        const lineStart = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.count));

        const lineEnd = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.count));

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add start year line
        g.append('path')
            .datum(startYearCounts)
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1.5)
            .attr('d', lineStart);

        // Add end year line
        g.append('path')
            .datum(endYearCounts)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 1.5)
            .attr('d', lineEnd);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x).ticks(0).tickFormat(() => '')); // No labels on x-axis

        g.append('g')
            .call(d3.axisLeft(y));
    }, [data, width, height]);

    return <div ref={chartRef}></div>;
};

export default LineGraph;
