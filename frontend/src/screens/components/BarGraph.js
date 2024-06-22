import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarGraph = ({ data, width, height }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const renderChart = (data) => {
            // Convert data to an array and sort it in descending order
            const dataArray = Object.entries(data).sort((a, b) => b[1] - a[1]);
            // Separate the top 5 and the rest
            const top5 = dataArray.slice(0, 5);
            const otherTotal = dataArray.slice(5).reduce((acc, d) => acc + d[1], 0);
            const processedData = otherTotal > 0 ? [...top5, ["Other", otherTotal]] : top5;

            const svg = d3.select(chartRef.current);

            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .rangeRound([0, innerWidth])
                .padding(0.1)
                .domain(processedData.map(d => d[0]));

            const y = d3.scaleLinear()
                .rangeRound([innerHeight, 0])
                .domain([0, d3.max(processedData, d => d[1])]);

            svg.selectAll('*').remove(); // Clear previous elements

            svg.attr('width', width)
                .attr('height', height)
                // .style('background', 'lightgreen') // Background color

            const chartGroup = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            chartGroup.selectAll('.bar')
                .data(processedData)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d[0]))
                .attr('y', d => y(d[1]))
                .attr('width', x.bandwidth())
                .attr('height', d => innerHeight - y(d[1]))
                .attr('fill', 'blue') // Bar color
                .attr('opacity', 0.7)
                .on('mouseover', function (event, d) {
                    d3.select(this).attr('opacity', 1); // Highlight effect

                    const [key, value] = d;
                    const tooltip = svg.append('g')
                        .attr('class', 'tooltip')
                        .style('display', 'none');

                    tooltip.append('rect')
                        .attr('fill', 'white')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 0.5)
                        .attr('width', 100)
                        .attr('height', 28)
                        .attr('x', x(key) + margin.left)
                        .attr('y', y(value) - 28);

                    tooltip.append('text')
                        .attr('fill', 'black')
                        .attr('x', x(key) + margin.left + 50)
                        .attr('y', y(value) - 10)
                        .attr('text-anchor', 'middle')
                        .text(`${key}: ${value}`);

                    tooltip.style('display', 'block');
                })
                .on('mouseout', function () {
                    d3.select(this).attr('opacity', 0.7); // Remove highlight
                    svg.select('.tooltip').remove();
                });

            chartGroup.append('g')
                .attr('transform', `translate(0, ${innerHeight})`)
                .call(d3.axisBottom(x));

            chartGroup.append('g')
                .call(d3.axisLeft(y));
        };

        renderChart(data);
    }, [data, width, height]);

    return (
        <svg ref={chartRef}></svg>
    );
};

export default BarGraph;
