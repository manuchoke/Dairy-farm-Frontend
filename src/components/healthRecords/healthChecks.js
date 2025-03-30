// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../config/urlConfig';
// import './styles/RoutineHealthCheck.css';

// const HealthCheckForm = ({ onClose, onRecordAdded, initialData }) => {
//   const [formData, setFormData] = useState({
//     tagId: initialData?.tagId || '',
//     date: initialData?.date || '',
//     weight: initialData?.weight || '',
//     bodyConditionScore: initialData?.bodyConditionScore || '',
//     vetNotes: initialData?.vetNotes || '',
//   });

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (initialData) {
//         // Update existing record
//         await axios.put(`${BASE_URL}/api/healthChecks/${initialData._id}`, formData);
//       } else {
//         // Create new record
//         await axios.post(`${BASE_URL}/api/healthChecks`, formData);
//       }
//       onRecordAdded(formData);
//       setFormData({
//         tagId: '',
//         date: '',
//         weight: '',
//         bodyConditionScore: '',
//         vetNotes: '',
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error adding/updating health check record:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="form-container">
//       <div>
//         <label>Tag ID:</label>
//         <input type="text" name="tagId" value={formData.tagId} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Date:</label>
//         <input type="date" name="date" value={formData.date} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Weight:</label>
//         <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Body Condition Score:</label>
//         <input type="number" step="0.1" name="bodyConditionScore" value={formData.bodyConditionScore} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Vet Notes:</label>
//         <textarea name="vetNotes" value={formData.vetNotes} onChange={handleChange} required></textarea>
//       </div>
//       <button type="submit">Submit</button>
//       <button type="button" onClick={onClose}>Cancel</button>
//     </form>
//   );
// };

// export default HealthCheckForm;

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import './styles/RoutineHealthCheck.css';

const HealthCheckForm = ({ onClose, onRecordAdded, initialData }) => {
  const [formData, setFormData] = useState({
    tagId: initialData?.tagId || '',
    date: initialData?.date || '',
    weight: initialData?.weight || '',
    bodyConditionScore: initialData?.bodyConditionScore || '',
    vetNotes: initialData?.vetNotes || '',
  });

  const [animalTags, setAnimalTags] = useState([]);

  // Fetch animal tags on component mount
  useEffect(() => {
    const fetchAnimalTags = async () => {
      try {
        const response = await axios.get('/api/animals');
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
        await axios.put(`/api/healthChecks/${initialData._id}`, formData);
      } else {
        // Create new record
        await axios.post('/api/healthChecks', formData);
      }
      onRecordAdded(formData);
      setFormData({
        tagId: '',
        date: '',
        weight: '',
        bodyConditionScore: '',
        vetNotes: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding/updating health check record:', error);
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
        <label>Weight:</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
      </div>
      <div>
        <label>Body Condition Score:</label>
        <input type="number" step="0.1" name="bodyConditionScore" value={formData.bodyConditionScore} onChange={handleChange} required />
      </div>
      <div>
        <label>Vet Notes:</label>
        <textarea name="vetNotes" value={formData.vetNotes} onChange={handleChange} required></textarea>
      </div>
      <button type="submit" className="submit-button">Submit</button>
      <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default HealthCheckForm;