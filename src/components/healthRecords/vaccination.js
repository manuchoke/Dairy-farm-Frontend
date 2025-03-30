// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../config/urlConfig';
// import './styles/VaccinationForm.css';

// const VaccinationForm = ({ onClose, onRecordAdded, initialData }) => {
//   const [formData, setFormData] = useState({
//     tagId: initialData?.tagId || '',
//     date: initialData?.date || '',
//     vaccine: initialData?.vaccine || '',
//     dosage: initialData?.dosage || '',
//     nextDueDate: initialData?.nextDueDate || '',
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
//         await axios.put(`${BASE_URL}/api/vaccinations/${initialData._id}`, formData);
//       } else {
//         // Create new record
//         await axios.post(`${BASE_URL}/api/vaccinations`, formData);
//       }
//       onRecordAdded(formData);
//       setFormData({
//         tagId: '',
//         date: '',
//         vaccine: '',
//         dosage: '',
//         nextDueDate: '',
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error adding/updating vaccination record:', error);
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
//         <label>Vaccine:</label>
//         <input type="text" name="vaccine" value={formData.vaccine} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Dosage:</label>
//         <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Next Due Date:</label>
//         <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} required />
//       </div>
//       <button type="submit">Submit</button>
//       <button type="button" onClick={onClose}>Cancel</button>
//     </form>
//   );
// };

// export default VaccinationForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/urlConfig';
import './styles/VaccinationForm.css';

const VaccinationForm = ({ onClose, onRecordAdded, initialData }) => {
  const [formData, setFormData] = useState({
    tagId: initialData?.tagId || '',
    date: initialData?.date || '',
    vaccine: initialData?.vaccine || '',
    dosage: initialData?.dosage || '',
    nextDueDate: initialData?.nextDueDate || '',
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
        await axios.put(`${BASE_URL}/vaccinations/${initialData._id}`, formData);
      } else {
        // Create new record
        await axios.post(`${BASE_URL}/vaccinations`, formData);
      }
      onRecordAdded(formData);
      setFormData({
        tagId: '',
        date: '',
        vaccine: '',
        dosage: '',
        nextDueDate: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding/updating vaccination record:', error);
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
        <label>Vaccine:</label>
        <input type="text" name="vaccine" value={formData.vaccine} onChange={handleChange} required />
      </div>
      <div>
        <label>Dosage:</label>
        <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required />
      </div>
      <div>
        <label>Next Due Date:</label>
        <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} required />
      </div>
      <button type="submit" className="submit-button">Submit</button>
      <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default VaccinationForm;