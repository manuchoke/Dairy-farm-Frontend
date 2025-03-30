// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../config/urlConfig';
// import './styles/ReproductiveHealthForm.css';

// const ReproductiveHealthForm = ({ onClose, onRecordAdded, initialData }) => {
//   const [formData, setFormData] = useState({
//     tagId: initialData?.tagId || '',
//     breedingDate: initialData?.breedingDate || '',
//     pregnancyCheckDate: initialData?.pregnancyCheckDate || '',
//     result: initialData?.result || '',
//     calvingDate: initialData?.calvingDate || '',
//     postPartumHealthStatus: initialData?.postPartumHealthStatus || '',
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
//         await axios.put(`${BASE_URL}/api/reproductiveHealth/${initialData._id}`, formData);
//       } else {
//         // Create new record
//         await axios.post(`${BASE_URL}/api/reproductiveHealth`, formData);
//       }
//       onRecordAdded(formData);
//       setFormData({
//         tagId: '',
//         breedingDate: '',
//         pregnancyCheckDate: '',
//         result: '',
//         calvingDate: '',
//         postPartumHealthStatus: '',
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error adding/updating reproductive health record:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="form-container">
//       <div>
//         <label>Tag ID:</label>
//         <input type="text" name="tagId" value={formData.tagId} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Breeding Date:</label>
//         <input type="date" name="breedingDate" value={formData.breedingDate} onChange={handleChange} required />
//       </div>
//       <div>
//         <label>Pregnancy Check Date:</label>
//         <input type="date" name="pregnancyCheckDate" value={formData.pregnancyCheckDate} onChange={handleChange} />
//       </div>
//       <div>
//         <label>Result:</label>
//         <input type="text" name="result" value={formData.result} onChange={handleChange} />
//       </div>
//       <div>
//         <label>Calving Date:</label>
//         <input type="date" name="calvingDate" value={formData.calvingDate} onChange={handleChange} />
//       </div>
//       <div>
//         <label>Post-Partum Health Status:</label>
//         <textarea name="postPartumHealthStatus" value={formData.postPartumHealthStatus} onChange={handleChange}></textarea>
//       </div>
//       <button type="submit">Submit</button>
//       <button type="button" onClick={onClose}>Cancel</button>
//     </form>
//   );
// };

// export default ReproductiveHealthForm;

import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import './styles/ReproductiveHealthForm.css';

const ReproductiveHealthForm = ({ onClose, onRecordAdded, initialData }) => {
  const [formData, setFormData] = useState({
    tagId: initialData?.tagId || '',
    breedingDate: initialData?.breedingDate || '',
    pregnancyCheckDate: initialData?.pregnancyCheckDate || '',
    result: initialData?.result || '',
    calvingDate: initialData?.calvingDate || '',
    postPartumHealthStatus: initialData?.postPartumHealthStatus || '',
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
        await axios.put(`/api/reproductiveHealth/${initialData._id}`, formData);
      } else {
        // Create new record
        await axios.post('/api/reproductiveHealth', formData);
      }
      onRecordAdded(formData);
      setFormData({
        tagId: '',
        breedingDate: '',
        pregnancyCheckDate: '',
        result: '',
        calvingDate: '',
        postPartumHealthStatus: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding/updating reproductive health record:', error);
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
        <label>Breeding Date:</label>
        <input type="date" name="breedingDate" value={formData.breedingDate} onChange={handleChange} required />
      </div>
      <div>
        <label>Pregnancy Check Date:</label>
        <input type="date" name="pregnancyCheckDate" value={formData.pregnancyCheckDate} onChange={handleChange} />
      </div>
      <div>
        <label>Result:</label>
        <input type="text" name="result" value={formData.result} onChange={handleChange} />
      </div>
      <div>
        <label>Calving Date:</label>
        <input type="date" name="calvingDate" value={formData.calvingDate} onChange={handleChange} />
      </div>
      <div>
        <label>Post-Partum Health Status:</label>
        <textarea name="postPartumHealthStatus" value={formData.postPartumHealthStatus} onChange={handleChange}></textarea>
      </div>
      <button type="submit" className="submit-button">Submit</button>
      <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default ReproductiveHealthForm;