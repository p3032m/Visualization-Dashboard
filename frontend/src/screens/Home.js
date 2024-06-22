import React, { useState, useEffect } from 'react';
import { Card } from "@material-tailwind/react";
import BarGraph from './components/BarGraph';
import LineGraph from './components/LineGraph'; // Assuming you have a LineGraph component
import Filters from './components/Filters';
import PieChart from './components/PieChart';
import YearFrequencyRatioChart from './components/YearFrequencyRatioChart';
import DonutChart from './components/DonutChart';
import RelevenceBarGraph from './components/RelevenceBarChart';

import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";

function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [sectorCounts, setSectorCounts] = useState({});
  const [topicCounts, setTopicCounts] = useState({});
  const [likelihoodCounts, setLikelihoodCounts] = useState({});
  const [filterbox, setFilterbox] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}data/getjson`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        setJsonData(data);
        setFilteredData(data); // Initialize filteredData with fetched data
      } catch (err) {
        setError(err.message || 'Error fetching data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Only update counts if filteredData is available
    if (filteredData) {
      setSectorCounts(countSectors(filteredData));
      setTopicCounts(countTopics(filteredData));
      setLikelihoodCounts(countLikelihoods(filteredData));
    }
  }, [filteredData]);

  const handleFilterChange = (filters) => {
    let filtered = jsonData;

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => item[key] === filters[key]);
      }
    });

    setFilteredData(filtered);
  };

  const countSectors = (data) => {
    const sectorCounts = {};

    data.forEach(item => {
      const sector = item.sector || "Other"; 
      if (sectorCounts[sector]) {
        sectorCounts[sector] += 1;
      } else {
        sectorCounts[sector] = 1;
      }
    });

    return sectorCounts;
  };

  const countLikelihoods = (data) => {
    const likelihoodCounts = {};

    data.forEach(item => {
      const likelihood = item.likelihood || "Other"; 
      if (likelihoodCounts[likelihood]) {
        likelihoodCounts[likelihood] += 1;
      } else {
        likelihoodCounts[likelihood] = 1;
      }
    });

    return likelihoodCounts;
  };

  const countTopics = (data) => {
    const topicCounts = {};

    data.forEach(item => {
      let topic = item.topic || "Other"; 
      if (!topic.trim()) topic = "Other"; 
      
      if (topicCounts[topic]) {
        topicCounts[topic] += 1;
      } else {
        topicCounts[topic] = 1;
      }
    });

    const sortedTopics = Object.keys(topicCounts).sort((a, b) => topicCounts[b] - topicCounts[a]);
    const top4Topics = sortedTopics.slice(0, 4);
    let otherCount = 0;

    sortedTopics.slice(4).forEach(topic => {
      otherCount += topicCounts[topic];
    });

    const modifiedTopicCounts = {};
    top4Topics.forEach(topic => {
      modifiedTopicCounts[topic] = topicCounts[topic];
    });

    if (otherCount > 0) {
      modifiedTopicCounts["Other"] = otherCount;
    }

    return modifiedTopicCounts;
  };

  const countRelevance = (data) => {
    const relevanceCounts = {};

    data.forEach(item => {
        let relevance = item.relevance;
        if (relevance === 6 || relevance === 7) {
            relevance = "6-7";
        } else {
            relevance = relevance ? relevance.toString() : "Other"; 
        }

        if (relevanceCounts[relevance]) {
            relevanceCounts[relevance] += 1;
        } else {
            relevanceCounts[relevance] = 1;
        }
    });

    return relevanceCounts;
  };

  const relevanceCounts = countRelevance(filteredData);

  const toggleFilterbox = () => {
    setFilterbox(!filterbox);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!jsonData) {
    return <div>Loading...</div>;
  }

  return (
    <div className=''>
      <div className='w-full'>
        <h1 className='text-2xl font-bold mb-4 mx-auto w-full text-center mt-2'>
          <span className='mr-4'>Visualization Dashboard</span>
          <Popover placement="bottom" className='ml-4'>
            <PopoverHandler>
              <Button className='bg-blue-800' onClick={toggleFilterbox}>
                {filterbox ? 'Close Filters' : 'Add Filters'}
              </Button>
            </PopoverHandler>
            <PopoverContent className='fixed inset-0 flex items-center justify-center'>
              <div className='bg-white p-4 rounded shadow-md'>
                <Filters data={jsonData} onFilterChange={handleFilterChange} />
              </div>
            </PopoverContent>
          </Popover>
        </h1>
      </div>
      <div className='flex flex-wrap justify-center space-x-4'>
        <div className='max-w-lg w-full mb-4'>
          <Card>
            <div className='ml-2 text-lg font-semibold text-blue-gray-600 mt-1'>Sector Frequency Bar Graph</div>
            <div style={{ height: '400px' }}>
              <BarGraph data={sectorCounts} width={500} height={400} />
            </div>
          </Card>
        </div>
        <div className='max-w-lg w-full mb-4'>
          <Card>
            <div className='ml-2 text-lg font-semibold text-blue-gray-600 mt-1'>Topic Frequency Line Graph</div>
            <div style={{ height: '400px' }}>
              <LineGraph data={topicCounts} width={500} height={400} />
            </div>
          </Card>
        </div>
        <div className='max-w-sm w-full mb-4 pb-4'>
          <Card>
            <div className='text-center text-lg font-semibold text-blue-gray-600 my-1'>Pie Chart on Likelihood Frequency</div>
            <div style={{ height: '420px' }}>
              <PieChart data={likelihoodCounts} width={400} height={400} />
            </div>
          </Card>
        </div>
        <div className='max-w-sm w-full mb-4 pb-4'>
          <Card>
            <div className='text-center text-lg font-semibold text-blue-gray-600 mt-1'>Start Year and End Year distribution line graph</div>
            <div style={{ height: '400px' }}>
              <YearFrequencyRatioChart data={filteredData} width={380} height={400} />
            </div>
          </Card>
        </div>
        <div className='max-w-sm w-full mb-4 pb-4'>
          <Card>
            <div className='text-center text-lg font-semibold text-blue-gray-600 mt-1'>Region and Country frequency distribution</div>
            <div style={{ height: '400px' }}>
              <DonutChart data={filteredData} width={380} height={400} />
            </div>
          </Card>
        </div>
        <div className='max-w-lg w-full mb-4'>
          <Card>
            <div className='ml-2 text-lg font-semibold text-blue-gray-600 mt-1'>Relevance Frequency Bar Graph</div>
            <div style={{ height: '400px' }}>
              <RelevenceBarGraph data={relevanceCounts} width={500} height={400} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
