import React, { useState } from 'react';
import { Select, Option } from "@material-tailwind/react";

const Filters = ({ data, onFilterChange }) => {
  const [filters, setFilters] = useState({
    end_year: '',
    sector: '',
    topic: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  const extractUniqueValues = (field) => {
    const uniqueValues = Array.from(new Set(data.map(item => item[field]).filter(Boolean)));
    uniqueValues.sort();
    return uniqueValues;
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      end_year: '',
      sector: '',
      topic: '',
      region: '',
      pestle: '',
      source: '',
      swot: '',
      country: '',
      city: ''
    });
    onFilterChange({
      end_year: '',
      sector: '',
      topic: '',
      region: '',
      pestle: '',
      source: '',
      swot: '',
      country: '',
      city: ''
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <Select label="End Year" onChange={(value) => handleFilterChange('end_year', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('end_year').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="Sector" onChange={(value) => handleFilterChange('sector', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('sector').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="Topic" onChange={(value) => handleFilterChange('topic', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('topic').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="Region" onChange={(value) => handleFilterChange('region', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('region').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="PEST" onChange={(value) => handleFilterChange('pestle', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('pestle').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="Source" onChange={(value) => handleFilterChange('source', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('source').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="SWOT" onChange={(value) => handleFilterChange('swot', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('swot').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="Country" onChange={(value) => handleFilterChange('country', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('country').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>
      <Select label="City" onChange={(value) => handleFilterChange('city', value)}>
        <Option value="">All</Option>
        {extractUniqueValues('city').map((value, index) => (
          <Option key={index} value={value}>{value}</Option>
        ))}
      </Select>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;
