import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/urlConfig';
import './styles/LabTestForm.css';

const LabTestsForm = ({ onClose, onRecordAdded, initialData }) => {
  const [formData, setFormData] = useState({
    tagId: initialData?.tagId || '',
    date: initialData?.date || '',
    typeOfTest: initialData?.typeOfTest || '',
    results: initialData?.results || '',
    followUpActions: initialData?.followUpActions || '',
  });

  const [animalTags, setAnimalTags] = useState([]);

  // Fetch animal tags on component mount
  useEffect(() => {
    const fetchAnimalTags = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/animals`);
        const tags = response.data.map((animal) => animal.tagId);
        setAnimalTags(tags);
      } catch (error) {
        console.error('Error fetching animal tags:', error);
      }
    };

    fetchAnimalTags();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        // Update existing record
        await axios.put(`${BASE_URL}/labTests/${initialData._id}`, formData);
      } else {
        // Create new record
        await axios.post(`${BASE_URL}/labTests`, formData);
      }
      onRecordAdded(formData);
      setFormData({
        tagId: '',
        date: '',
        typeOfTest: '',
        results: '',
        followUpActions: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding/updating lab test record:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label>Tag ID:</label>
        <select name="tagId" value={formData.tagId} onChange={handleChange} required>
          <option value="" disabled>Select Tag ID</option>
          {animalTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      </div>
      <div>
        <label>Type of Test:</label>
        <input type="text" name="typeOfTest" value={formData.typeOfTest} onChange={handleChange} required />
      </div>
      <div>
        <label>Results:</label>
        <input type="text" name="results" value={formData.results} onChange={handleChange} required />
      </div>
      <div>
        <label>Follow-Up Actions:</label>
        <textarea name="followUpActions" value={formData.followUpActions} onChange={handleChange} required></textarea>
      </div>
      <button type="submit" className="submit-button">Submit</button>
      <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default LabTestsForm;