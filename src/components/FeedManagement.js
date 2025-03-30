import React, { useEffect, useState, useCallback } from "react";
import axios from "../utils/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FeedManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    cost: "",
    datePurchased: new Date()
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingFeed, setEditingFeed] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Summary states
  const [dailyRecords, setDailyRecords] = useState([]);
  const [weeklyRecords, setWeeklyRecords] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [yearlyRecords, setYearlyRecords] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalFeeds, setTotalFeeds] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const getWeekNumber = useCallback((date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }, []);

  const processRecordsByPeriod = useCallback((records, periodType) => {
    if (!Array.isArray(records)) {
      return [];
    }

    const periodData = {};

    records.forEach(record => {
      const date = new Date(record.datePurchased);
      let periodKey;

      switch (periodType) {
        case 'week':
          const weekNum = getWeekNumber(date);
          periodKey = `Week ${weekNum}, ${date.getFullYear()}`;
          break;
        case 'month':
          periodKey = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
          break;
        case 'year':
          periodKey = date.getFullYear().toString();
          break;
        default:
          return;
      }

      if (!periodData[periodKey]) {
        periodData[periodKey] = {
          period: periodKey,
          feeds: [],
          totalQuantity: 0,
          totalCost: 0
        };
      }

      periodData[periodKey].feeds.push(record);
      periodData[periodKey].totalQuantity += Number(record.quantity);
      periodData[periodKey].totalCost += Number(record.cost);
    });

    return Object.values(periodData).sort((a, b) => b.period.localeCompare(a.period));
  }, [getWeekNumber]);

  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/feed-management');

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const processedRecords = response.data.map(feed => ({
        ...feed,
        datePurchased: new Date(feed.datePurchased)
      }));

      // Sort by date descending
      const sortedRecords = processedRecords.sort((a, b) => 
        new Date(b.datePurchased) - new Date(a.datePurchased)
      );

      setDailyRecords(sortedRecords);

      // Process aggregated records
      const weeklyData = processRecordsByPeriod(processedRecords, 'week');
      const monthlyData = processRecordsByPeriod(processedRecords, 'month');
      const yearlyData = processRecordsByPeriod(processedRecords, 'year');

      setWeeklyRecords(weeklyData);
      setMonthlyRecords(monthlyData);
      setYearlyRecords(yearlyData);
      
      // Calculate totals
      const totalQty = processedRecords.reduce((sum, feed) => sum + Number(feed.quantity), 0);
      const totalFeedCost = processedRecords.reduce((sum, feed) => sum + Number(feed.cost), 0);
      
      setTotalQuantity(totalQty);
      setTotalFeeds(processedRecords.length);
      setTotalCost(totalFeedCost);
      
    } catch (error) {
      console.error("Error fetching feeds:", error);
      
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        setError("Feed management endpoint not found. Please check the server configuration.");
      } else {
        setError(error.response?.data?.message || error.message || "Failed to fetch feeds");
      }
    } finally {
      setLoading(false);
    }
  }, [processRecordsByPeriod]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? 
      (e.target.value === '' ? '' : Number(e.target.value)) : 
      e.target.value;
    
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      datePurchased: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        quantity: Number(formData.quantity),
        cost: Number(formData.cost),
        datePurchased: formData.datePurchased
      };

      if (editingFeed) {
        const response = await axios.put(
          `/api/feed-management/${editingFeed._id}`,
          data
        );
        if (!response.data) {
          throw new Error('Failed to update feed record');
        }
      } else {
        const response = await axios.post(
          '/api/feed-management',
          data
        );
        if (!response.data) {
          throw new Error('Failed to create feed record');
        }
      }

      await fetchFeeds();
      setFormData({ name: "", quantity: "", unit: "", cost: "", datePurchased: new Date() });
      setEditingFeed(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving feed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save feed";
      alert(errorMessage);
    }
  };

  const handleEdit = (feed) => {
    setEditingFeed(feed);
    setFormData({
      name: feed.name,
      quantity: feed.quantity,
      unit: feed.unit,
      cost: feed.cost,
      datePurchased: new Date(feed.datePurchased)
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feed-management/${id}`);
      await fetchFeeds();
    } catch (error) {
      console.error("Error deleting feed:", error);
      alert(error.response?.data?.message || error.message || "Failed to delete feed");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchFeeds}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold bg-blue-500 p-4 rounded text-white mb-12">Feed Management</h1>

      {/* Summary Section */}
      <div className="mb-4 p-3 border bg-gray-100 rounded">
        <p className="text-lg font-semibold">Total Feeds: {totalFeeds}</p>
        <p className="text-lg font-semibold">Total Quantity: {totalQuantity} kgs</p>
        <p className="text-lg font-semibold">Total Cost: Ksh.{totalCost.toFixed(2)}</p>
      </div>

      {/* Add Feed Button */}
      <button
        onClick={() => {
          setShowForm(true);
          setEditingFeed(null);
          setFormData({ name: "", quantity: "", unit: "", cost: "", datePurchased: new Date() });
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Feed
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Feed Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="unit"
              placeholder="Unit (kgs)"
              value={formData.unit}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="cost"
              placeholder="Cost"
              value={formData.cost}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <div className="flex items-center">
              <DatePicker
                selected={formData.datePurchased}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="border p-2 rounded w-full"
                maxDate={new Date()}
                required
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingFeed ? 'Update Feed' : 'Add Feed'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
      </form>
      )}

      {/* Date Filter */}
      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>
      <h2 className="text-xl font-bold bg-blue-500 p-4 rounded text-white mb-12 text-center">Feed Records</h2>

      {/* Daily Records */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Daily Feed Records</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Unit(kgs) </th>
            <th className="border p-2">Cost</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
            {dailyRecords.length > 0 ? (
              dailyRecords.map((feed) => (
                <tr key={feed._id}>
                  <td className="border p-2">
                    {new Date(feed.datePurchased).toLocaleDateString()}
                  </td>
                <td className="border p-2">{feed.name}</td>
                <td className="border p-2">{feed.quantity}</td>
                <td className="border p-2">{feed.unit}</td>
                  <td className="border p-2">Ksh.{Number(feed.cost).toFixed(2)}</td>
                <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(feed)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(feed._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="6" className="text-center p-4">No feeds found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Weekly Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Weekly Summary</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Week</th>
              <th className="border p-2">Total Quantity(kgs)</th>
              <th className="border p-2">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {weeklyRecords.length > 0 ? (
              weeklyRecords.map((record) => (
                <tr key={record.period}>
                  <td className="border p-2">{record.period}</td>
                  <td className="border p-2">{record.totalQuantity.toFixed(2)}</td>
                    <td className="border p-2">Ksh.{record.totalCost.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">No weekly records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Monthly Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Monthly Summary</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Month</th>
              <th className="border p-2">Total Quantity(kgs) </th>
              <th className="border p-2">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {monthlyRecords.length > 0 ? (
              monthlyRecords.map((record) => (
                <tr key={record.period}>
                  <td className="border p-2">{record.period}</td>
                  <td className="border p-2">{record.totalQuantity.toFixed(2)}</td>
                  <td className="border p-2">Ksh.{record.totalCost.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">No monthly records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Yearly Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Yearly Summary</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Year</th>
              <th className="border p-2">Total Quantity(kgs)</th>
              <th className="border p-2">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {yearlyRecords.length > 0 ? (
              yearlyRecords.map((record) => (
                <tr key={record.period}>
                  <td className="border p-2">{record.period}</td>
                  <td className="border p-2">{record.totalQuantity.toFixed(2)}</td>
                  <td className="border p-2">Ksh.{record.totalCost.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4">No yearly records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedManagement;
