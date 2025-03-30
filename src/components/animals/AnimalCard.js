import React, { useState } from "react";
import axios, { getImageUrl } from '../../utils/axios';

const AnimalCard = ({ animal, fetchAnimals }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [updatedAnimal, setUpdatedAnimal] = useState({ ...animal }); // State for updated animal data

  // Handle Update Form Submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/animals/${animal._id}`, updatedAnimal);
      setIsEditing(false); // Exit edit mode
      fetchAnimals(); // Refresh the list of animals
    } catch (error) {
      console.error("Error updating animal:", error.response?.data || error.message);
      alert("Failed to update animal.");
    }
  };

  // Handle Delete Button Click
  const handleDelete = async () => {
    try {
      if (window.confirm(`Are you sure you want to delete ${animal.tagId} - ${animal.breed}?`)) {
        await axios.delete(`/api/animals/${animal._id}`);
        fetchAnimals(); // Refresh the list of animals
      }
    } catch (error) {
      console.error("Error deleting animal:", error.response?.data || error.message);
      alert("Failed to delete animal.");
    }
  };

  // Handle Input Changes in Edit Mode
  const handleInputChange = (e) => {
    setUpdatedAnimal({ ...updatedAnimal, [e.target.name]: e.target.value });
  };

  return (
    <div className="animal-cards-container">
      <div className="max-w-xs rounded overflow-hidden shadow-lg m-4">
        {/* Image Section */}
        <div className="imgDiv">
          {animal.image ? (
            <img className="w-full" src={getImageUrl(animal.image)} alt={animal.breed} />
          ) : (
            <div className="bg-gray-300 text-center py-4">No Image</div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-6 py-4">
          {isEditing ? (
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-2">
                <label className="block text-gray-700 font-bold mb-1">
                  <span className="inline-flex items-center">
                    <i className="fas fa-tag mr-2"></i>
                    Tag ID:
                  </span>
                </label>
                <input
                  type="text"
                  name="tagId"
                  value={updatedAnimal.tagId}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-2">
                <label className="block text-gray-700 font-bold mb-1">
                  <span className="inline-flex items-center">
                    <i className="fas fa-horse mr-2"></i>
                    Breed:
                  </span>
                </label>
                <input
                  type="text"
                  name="breed"
                  value={updatedAnimal.breed}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)} // Cancel editing
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="font-bold text-xl mb-2">
                <span className="inline-flex items-center">
                  <i className="fas fa-tag mr-2"></i>
                  Tag ID: {animal.tagId}
                </span>
              </div>
              <p className="text-gray-700 text-base">
                <span className="inline-flex items-center">
                  <i className="fas fa-horse mr-2"></i>
                  Breed: {animal.breed}
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsEditing(true)} // Toggle edit mode
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete} // Delete the animal
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;