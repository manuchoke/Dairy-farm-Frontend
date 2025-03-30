import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './styles/salesScreen.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesScreen = () => {
  const [milkData, setMilkData] = useState(null);
  const [feedData, setFeedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch milk production data
        const milkResponse = await axios.get('/api/milk-production/all');
        const processedMilkData = processMilkData(milkResponse.data);
        setMilkData(processedMilkData);

        // Fetch feed data
        const feedResponse = await axios.get('/api/feed-management');
        const processedFeedData = processFeedData(feedResponse.data);
        setFeedData(processedFeedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processMilkData = (data) => {
    // Group data by date and calculate total milk production
    const groupedData = data.reduce((acc, record) => {
      const date = new Date(record.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += record.totalMilk;
      return acc;
    }, {});

    // Sort dates and prepare data for chart
    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Daily Milk Production (Liters)',
        data: sortedDates.map(date => groupedData[date]),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  };

  const processFeedData = (data) => {
    // Group data by date and calculate total feed cost
    const groupedData = data.reduce((acc, record) => {
      const date = new Date(record.datePurchased).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += record.cost;
      return acc;
    }, {});

    // Sort dates and prepare data for chart
    const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Daily Feed Cost (Ksh.)',
        data: sortedDates.map(date => groupedData[date]),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="sales-screen p-4">
      <h1 className="text-2xl font-bold bg-blue-500 p-4 rounded text-white mb-12">Sales Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milk Production Chart */}
        <div className="chart-container">
          <h3 className="text-xl font-semibold mb-4">Milk Production Analysis</h3>
          <div className="chart">
            <Line data={milkData} options={chartOptions} />
          </div>
        </div>

        {/* Feed Management Chart */}
        <div className="chart-container">
          <h3 className="text-xl font-semibold mb-4">Feed Cost Analysis</h3>
          <div className="chart">
            <Line data={feedData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesScreen;
