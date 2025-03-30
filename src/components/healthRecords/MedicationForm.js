// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../config/urlConfig';
// import './styles/MedicationAdministration.css';

// const MedicationAdministrationForm = ({ onClose, onRecordAdded, initialData }) => {
//   const [formData, setFormData] = useState({
//     tagId: initialData?.tagId || '',
//     date: initialData?.date || '',
//     medicationName: initialData?.medicationName || '',
//     dosage: initialData?.dosage || '',
//     method: initialData?.method || '',
//     administeredBy: initialData?.administeredBy || '',
//     notes: initialData?.notes || '',
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
//         await axios.put(`${BASE_URL}/api/medications/${initialData._id}`, formData);
//       } else {
//         // Create new record
//         await axios.post(`${BASE_URL}/api/medications`, formData);
//       }
//       onRecordAdded(formData);
//       setFormData({
//         tagId: '',
//         date: '',
//         medicationName: '',
//         dosage: '',
//         method: '',
//         administeredBy: '',
//         notes: '',
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error adding/updating medication record:', error);
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
//         <label>Medication Name:</label>
//         <input type="text" name="medicationName" value={formData.medicationName} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Dosage:</label>
//         <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Method:</label>
//         <input type="text" name="method" value={formData.method} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Administered By:</label>
//         <input type="text" name="administeredBy" value={formData.administeredBy} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Notes:</label>
//         <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
//       </div>
//       <button type="submit">Submit</button>
//       <button type="button" onClick={onClose}>Cancel</button>
//     </form>
//   );
// };

// export default MedicationAdministrationForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/urlConfig';
import './styles/MedicationAdministration.css';

const MedicationAdministrationForm = ({ onClose, onRecordAdded, initialData }) => {
  const [formData, setFormData] = useState({
    tagId: initialData?.tagId || '',
    date: initialData?.date || '',
    medicationName: initialData?.medicationName || '',
    dosage: initialData?.dosage || '',
    method: initialData?.method || '',
    administeredBy: initialData?.administeredBy || '',
    notes: initialData?.notes || '',
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
        await axios.put(`${BASE_URL}/medications/${initialData._id}`, formData);
      } else {
        // Create new record
        await axios.post(`${BASE_URL}/medications`, formData);
      }
      onRecordAdded(formData);
      setFormData({
        tagId: '',
        date: '',
        medicationName: '',
        dosage: '',
        method: '',
        administeredBy: '',
        notes: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding/updating medication record:', error);
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
        <label>Medication Name:</label>
        <input type="text" name="medicationName" value={formData.medicationName} onChange={handleChange} required />
      </div>
      <div>
        <label>Dosage:</label>
        <input type="text" name="dosage" value={formData.dosage} onChange={handleChange} required />
      </div>
      <div>
        <label>Method:</label>
        <input type="text" name="method" value={formData.method} onChange={handleChange} required />
      </div>
      <div>
        <label>Administered By:</label>
        <input type="text" name="administeredBy" value={formData.administeredBy} onChange={handleChange} required />
      </div>
      <div>
        <label>Notes:</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
      </div>
      <button type="submit" className="submit-button">Submit</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default MedicationAdministrationForm;