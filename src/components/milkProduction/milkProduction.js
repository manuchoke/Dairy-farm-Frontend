import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MilkProductionForm from './milkProductionForm';
import './milkProductionScreen.css';

const MilkProduction = () => {
  const [showForm, setShowForm] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [weeklyRecords, setWeeklyRecords] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [yearlyRecords, setYearlyRecords] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch animals with authentication
  const fetchAnimals = useCallback(async () => {
    try {
      const response = await axios.get('/api/animals');

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid animals data received');
      }

      const validAnimals = response.data.filter(animal => 
        animal && 
        animal._id && 
        animal.tagId && 
        typeof animal.tagId === 'string'
      );

      setAnimals(validAnimals);
      return validAnimals;
    } catch (error) {
      console.error('Error fetching animals:', error.response || error);
      setError('Failed to fetch animals. Please try again.');
      return [];
    }
  }, []);

  const getWeekNumber = useCallback((date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }, []);

  const processRecordsByPeriod = useCallback((records, periodType, validAnimals) => {
    if (!Array.isArray(records) || !Array.isArray(validAnimals)) {
      console.error('Invalid input to processRecordsByPeriod:', { records, validAnimals });
      return [];
    }

    const periodData = {};

    records.forEach(record => {
      if (!record.date || !record.animalId || typeof record.totalMilk !== 'number') {
        console.log('Skipping invalid record:', record);
        return;
      }

        const date = new Date(record.date);
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
          animalTotals: {},
            total: 0,
            records: []
          };
        validAnimals.forEach(animal => {
          periodData[periodKey].animalTotals[animal._id] = 0;
        });
      }

      const animalId = record.animalId;
      if (periodData[periodKey].animalTotals.hasOwnProperty(animalId)) {
        periodData[periodKey].animalTotals[animalId] += record.totalMilk;
        periodData[periodKey].total += record.totalMilk;
        periodData[periodKey].records.push(record);
      }
    });

    return Object.values(periodData).sort((a, b) => b.period.localeCompare(a.period));
  }, [getWeekNumber]);

  // Fetch milk records with authentication
  const fetchMilkRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const validAnimals = await fetchAnimals();
      
      if (validAnimals.length === 0) {
        throw new Error('No valid animals found');
      }

      const response = await axios.get('/api/milk-production/all');

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid milk records data received');
      }

      // Create a map of animal IDs to tag IDs for quick lookup
      const animalMap = new Map(validAnimals.map(animal => [animal._id, animal.tagId]));

      // Process and validate records
      const processedRecords = response.data
        .filter(record => {
          const animalId = typeof record?.animalId === 'object' ? record?.animalId?._id : record?.animalId;
          
          const isValid = record && 
                         record._id &&
                         animalId &&
                         !isNaN(record.morningMilk) &&
                         !isNaN(record.eveningMilk) &&
                         animalMap.has(animalId);
          
          return isValid;
        })
        .map(record => {
          const animalId = typeof record.animalId === 'object' ? record.animalId._id : record.animalId;
          const tagId = animalMap.get(animalId);
          
          return {
            ...record,
            animalId: animalId,
            tagId: tagId,
            morningMilk: Number(record.morningMilk),
            eveningMilk: Number(record.eveningMilk),
            totalMilk: Number(record.morningMilk) + Number(record.eveningMilk),
            date: new Date(record.date)
          };
        });

      // Sort by date descending
      const sortedRecords = processedRecords.sort((a, b) => b.date - a.date);
      
      setDailyRecords(sortedRecords);

      // Process aggregated records
      const weeklyData = processRecordsByPeriod(processedRecords, 'week', validAnimals);
      const monthlyData = processRecordsByPeriod(processedRecords, 'month', validAnimals);
      const yearlyData = processRecordsByPeriod(processedRecords, 'year', validAnimals);

      setWeeklyRecords(weeklyData);
      setMonthlyRecords(monthlyData);
      setYearlyRecords(yearlyData);

      const total = processedRecords.reduce((sum, record) => sum + record.totalMilk, 0);
      setGrandTotal(total);

    } catch (error) {
      console.error('Error fetching milk records:', error.response || error);
      setError(error.message || 'Failed to fetch milk records');
    } finally {
      setLoading(false);
    }
  }, [fetchAnimals, processRecordsByPeriod]);

  useEffect(() => {
    fetchMilkRecords();
  }, [fetchMilkRecords]);

  const handleSubmit = async (formData) => {
    try {
      const recordData = {
        animalId: formData.animalId,
        morningMilk: Number(formData.morningMilk),
        eveningMilk: Number(formData.eveningMilk),
        date: formData.date
      };

      if (editingRecord) {
        await axios.put(
          `/api/milk-production/${editingRecord._id}`,
          recordData
        );
      } else {
        await axios.post(
          '/api/milk-production',
          recordData
        );
      }

      await fetchMilkRecords();
      setShowForm(false);
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving milk record:', error.response || error);
      setError(error.response?.data?.message || error.message || 'Failed to save milk record');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`/api/milk-production/${recordId}`);
      await fetchMilkRecords();
      } catch (error) {
      console.error('Error deleting milk record:', error.response || error);
      setError(error.response?.data?.message || error.message || 'Failed to delete milk record');
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
          onClick={fetchMilkRecords}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="milk-production-container">
      <h1 className="text-2xl font-bold bg-blue-500 p-4 rounded text-white mb-12 text-center">Milk Production</h1>
      <div className="icons flex justify-center">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <span>+ Add Milk Production Record</span>
        </button>
      </div>

      {showForm && (
        <MilkProductionForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
          initialData={editingRecord}
          isEditing={!!editingRecord}
          animals={animals}
        />
      )}

      <div className="records-section">
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
        </div>

        <div className="summary-stats">
          <h2 className="text-xl font-bold bg-blue-500 p-4 rounded text-white mb-12 text-center">Total Milk Production: {grandTotal.toFixed(2)} liters</h2>
        </div>

        <div className="records-tabs">
          {/* Daily Records */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Daily Milk Production Records</h3>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Animal Tag</th>
                  <th className="border p-2">Morning (L)</th>
                  <th className="border p-2">Evening (L)</th>
                  <th className="border p-2">Total (L)</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dailyRecords.length > 0 ? (
                  dailyRecords.map((record) => (
                  <tr key={record._id}>
                      <td className="border p-2">{record.date.toLocaleDateString()}</td>
                      <td className="border p-2">{record.tagId}</td>
                      <td className="border p-2">{record.morningMilk.toFixed(2)}</td>
                      <td className="border p-2">{record.eveningMilk.toFixed(2)}</td>
                      <td className="border p-2">{record.totalMilk.toFixed(2)}</td>
                    <td className="border p-2">
                        <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(record)}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record._id)}
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
                    <td colSpan="6" className="border p-2 text-center">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Weekly Records */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Weekly Milk Production Summary</h3>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border p-2">Week</th>
                  {animals.map((animal) => (
                    <th key={animal._id} className="border p-2">{animal.tagId} (L)</th>
                  ))}
                  <th className="border p-2">Total (L)</th>
                </tr>
              </thead>
              <tbody>
                {weeklyRecords.length > 0 ? (
                  weeklyRecords.map((record) => (
                    <tr key={record.period}>
                    <td className="border p-2">{record.period}</td>
                    {animals.map((animal) => (
                      <td key={animal._id} className="border p-2">
                          {(record.animalTotals[animal._id] || 0).toFixed(2)}
                      </td>
                    ))}
                    <td className="border p-2">{record.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={animals.length + 2} className="border p-2 text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Monthly Records */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Monthly Milk Production Summary</h3>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border p-2">Month</th>
                  {animals.map((animal) => (
                    <th key={animal._id} className="border p-2">{animal.tagId} (L)</th>
                  ))}
                  <th className="border p-2">Total (L)</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRecords.length > 0 ? (
                  monthlyRecords.map((record) => (
                    <tr key={record.period}>
                    <td className="border p-2">{record.period}</td>
                    {animals.map((animal) => (
                      <td key={animal._id} className="border p-2">
                          {(record.animalTotals[animal._id] || 0).toFixed(2)}
                      </td>
                    ))}
                    <td className="border p-2">{record.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={animals.length + 2} className="border p-2 text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Yearly Records */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Yearly Milk Production Summary</h3>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border p-2">Year</th>
                  {animals.map((animal) => (
                    <th key={animal._id} className="border p-2">{animal.tagId} (L)</th>
                  ))}
                  <th className="border p-2">Total (L)</th>
                </tr>
              </thead>
              <tbody>
                {yearlyRecords.length > 0 ? (
                  yearlyRecords.map((record) => (
                    <tr key={record.period}>
                    <td className="border p-2">{record.period}</td>
                    {animals.map((animal) => (
                      <td key={animal._id} className="border p-2">
                          {(record.animalTotals[animal._id] || 0).toFixed(2)}
                      </td>
                    ))}
                    <td className="border p-2">{record.total.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={animals.length + 2} className="border p-2 text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkProduction;
