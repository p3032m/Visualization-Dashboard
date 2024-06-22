import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ data, width, height }) => {
    const chartRef = useRef(null);
    const [selectedType, setSelectedType] = useState('region');

    useEffect(() => {
        // Function to prepare data
        const prepareData = (data, type) => {
            const counts = data.reduce((acc, d) => {
                const key = d[type];
                if (key) {
                    acc[key] = (acc[key] || 0) + 1;
                }
                return acc;
            }, {});

            let sortedData = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            if (sortedData.length > 5) {
                const otherTotal = sortedData.slice(5).reduce((acc, d) => acc + d[1], 0);
                sortedData = [...sortedData.slice(0, 5), ['Other', otherTotal]];
            }
            return sortedData;
        };

        // Render chart function
        const renderChart = (data) => {
            const radius = Math.min(width, height) / 2;
            const color = d3.scaleOrdinal(d3.schemeCategory10);

            d3.select(chartRef.current).selectAll('*').remove(); // Clear previous elements

            const svg = d3.select(chartRef.current)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2},${height / 2})`);

            const arc = d3.arc()
                .innerRadius(radius * 0.5)
                .outerRadius(radius * 0.8);

            const pie = d3.pie()
                .value(d => d[1])
                .sort(null);

            const path = svg.selectAll('path')
                .data(pie(data))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', (d, i) => color(i))
                .each(function (d) { this._current = d; }); // Store initial angles

            // Add transition on data change
            path.transition().duration(750).attrTween('d', arcTween);

            function arcTween(a) {
                const i = d3.interpolate(this._current, a);
                this._current = i(0);
                return (t) => arc(i(t));
            }
        };

        const filteredData = prepareData(data, selectedType);
        renderChart(filteredData);

    }, [data, width, height, selectedType]);

    return (
        <div>
            <div>
                <label>
                    <input
                        type="radio"
                        value="region"
                        checked={selectedType === 'region'}
                        onChange={() => setSelectedType('region')}
                        className='ml-2'
                    />
                    Region
                </label>
                <label>
                    <input
                        type="radio"
                        value="country"
                        checked={selectedType === 'country'}
                        onChange={() => setSelectedType('country')}
                        className='ml-2'
                    />
                    Country
                </label>
            </div>
            <div ref={chartRef}></div>
        </div>
    );
};

export default DonutChart;
