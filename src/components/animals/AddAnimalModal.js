import React, { useState } from "react";
import axios from '../../utils/axios';

const AddAnimalModal = ({ fetchAnimals }) => {
  const [formData, setFormData] = useState({ tagId: "", breed: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.tagId || !formData.breed || !image) {
      alert("Please fill in all fields and select an image.");
      setLoading(false);
      return;
    }

    const formDataWithImage = new FormData();
    formDataWithImage.append('tagId', formData.tagId);
    formDataWithImage.append('breed', formData.breed);
    formDataWithImage.append('image', image);

    try {
      const response = await axios.post('/api/animals/add-with-image', formDataWithImage, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert("Animal added successfully!");
        fetchAnimals();
        setFormData({ tagId: '', breed: '' });
        setImage(null);
      }
    } catch (error) {
      console.error("Error adding animal:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add animal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <div className="mb-2">
        <label className="block text-gray-700 font-bold mb-1 text-sm">Tag ID:</label>
        <input
          type="text"
          name="tagId"
          value={formData.tagId}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-white text-sm"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700 font-bold mb-1 text-sm">Breed:</label>
        <input
          type="text"
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-white text-sm"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-2">
        <label className="block text-gray-700 font-bold mb-1 text-sm">Image:</label>
        <input 
          type="file" 
          name="image" 
          onChange={handleImageChange} 
          accept="image/*" 
          className="text-sm"
          disabled={loading}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Adding...' : 'Add Animal'}
      </button>
    </form>
  );
};

export default AddAnimalModal;