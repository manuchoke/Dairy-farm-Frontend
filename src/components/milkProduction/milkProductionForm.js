import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './milkProductionForm.css';

const MilkProductionForm = ({ onSubmit, onClose, initialData, isEditing, animals }) => {
  const [formData, setFormData] = useState({
    _id: '',
    animalId: '',
    morningMilk: '',
    eveningMilk: '',
    date: new Date()
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || '',
        animalId: initialData.animalId || '',
        morningMilk: initialData.morningMilk || '',
        eveningMilk: initialData.eveningMilk || '',
        date: initialData.date ? new Date(initialData.date) : new Date()
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.animalId) {
      newErrors.animalId = 'Please select an animal';
    }

    if (!formData.morningMilk || isNaN(formData.morningMilk) || Number(formData.morningMilk) < 0) {
      newErrors.morningMilk = 'Please enter a valid morning milk amount';
    }

    if (!formData.eveningMilk || isNaN(formData.eveningMilk) || Number(formData.eveningMilk) < 0) {
      newErrors.eveningMilk = 'Please enter a valid evening milk amount';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    } else if (formData.date > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'morningMilk' || name === 'eveningMilk') {
      // Allow empty string or valid positive number
      if (value === '') {
        processedValue = '';
      } else {
        const num = Number(value);
        processedValue = num >= 0 ? num : 0;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date || new Date()
    }));
    
    if (errors.date) {
      setErrors(prev => ({
        ...prev,
        date: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      await onSubmit({
        ...formData,
        morningMilk: Number(formData.morningMilk),
        eveningMilk: Number(formData.eveningMilk)
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save record. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="milk-production-form-popup" style={{ backgroundColor: 'rgb(70, 68, 68)'} }>
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Edit Milk Production Record' : 'Add Milk Production Record'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Select Animal:</label>
          <select
            name="animalId"
            value={formData.animalId}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.animalId ? 'border-red-500' : ''}`}
            required
          >
            <option value="">-- Choose an Animal --</option>
            {animals.map(animal => (
              <option key={animal._id} value={animal._id}>
                {animal.tagId} - {animal.breed}
              </option>
            ))}
          </select>
          {errors.animalId && (
            <p className="text-red-500 text-sm mt-1">{errors.animalId}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Morning Milk (Liters):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="morningMilk"
            value={formData.morningMilk}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.morningMilk ? 'border-red-500' : ''}`}
            required
          />
          {errors.morningMilk && (
            <p className="text-red-500 text-sm mt-1">{errors.morningMilk}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Evening Milk (Liters):</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="eveningMilk"
            value={formData.eveningMilk}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.eveningMilk ? 'border-red-500' : ''}`}
            required
          />
          {errors.eveningMilk && (
            <p className="text-red-500 text-sm mt-1">{errors.eveningMilk}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Date:</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className={`w-full border rounded p-2 ${errors.date ? 'border-red-500' : ''}`}
            required
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {errors.submit && (
          <div className="text-red-500 text-sm mt-2">{errors.submit}</div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MilkProductionForm;
