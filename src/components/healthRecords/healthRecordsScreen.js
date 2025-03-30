import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import LabTestsForm from './labTest';
import MedicationAdministrationForm from './MedicationForm';
import ReproductiveHealthForm from './reproductiveHealth';
import VaccinationForm from './vaccination';
import HealthCheckForm from './healthChecks';
import './styles/healthRecordScreen.css';

const HealthRecordsScreen = () => {
  const [activeForm, setActiveForm] = useState(null); // Tracks which form is active
  const [editRowIndex, setEditRowIndex] = useState(null); // Tracks the row being edited
  const [editingRecord, setEditingRecord] = useState(null); // Holds temporary edited data
  const [activeButton, setActiveButton] = useState(null); // Track active button

  // States for storing records of each form type
  const [labTestRecords, setLabTestRecords] = useState([]);
  const [medicationRecords, setMedicationRecords] = useState([]);
  const [reproductiveHealthRecords, setReproductiveHealthRecords] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [healthCheckRecords, setHealthCheckRecords] = useState([]);

  // Mapping of form types to their respective record states
  const recordStates = {
    labTest: [labTestRecords, setLabTestRecords],
    medication: [medicationRecords, setMedicationRecords],
    reproductiveHealth: [reproductiveHealthRecords, setReproductiveHealthRecords],
    vaccination: [vaccinationRecords, setVaccinationRecords],
    healthCheck: [healthCheckRecords, setHealthCheckRecords],
  };

  // Fetch data from the backend on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Lab Tests
        const labTestsResponse = await axios.get('/api/labTests');
        setLabTestRecords(labTestsResponse.data);

        // Fetch Medications
        const medicationsResponse = await axios.get('/api/medications');
        setMedicationRecords(medicationsResponse.data);

        // Fetch Reproductive Health Records
        const reproductiveHealthResponse = await axios.get('/api/reproductiveHealth');
        setReproductiveHealthRecords(reproductiveHealthResponse.data);

        // Fetch Vaccinations
        const vaccinationsResponse = await axios.get('/api/vaccinations');
        setVaccinationRecords(vaccinationsResponse.data);

        // Fetch Health Checks
        const healthChecksResponse = await axios.get('/api/healthChecks');
        setHealthCheckRecords(healthChecksResponse.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchData();
  }, []);

  // Function to close the form
  const handleFormClose = () => {
    setActiveForm(null);
    setEditRowIndex(null);
    setEditingRecord(null); // Reset editing state
  };

  // Function to add a new record
  const addRecord = (formType, record) => {
    if (recordStates[formType]) {
      const [records, setRecords] = recordStates[formType];

      // Save to backend
      axios.post(`/api/${formType}`, record)
        .then(() => {
          setRecords([...records, { ...record, lastUpdated: new Date().toLocaleString() }]);
        })
        .catch(error => console.error('Error adding record:', error));
    }
  };

  // Function to delete a record
  const deleteRecord = (formType, recordIndex) => {
    if (recordStates[formType]) {
      const [records, setRecords] = recordStates[formType];
      const recordToDelete = records[recordIndex];

      // Map form types to API endpoints
      const endpoints = {
        labTest: 'labTests',
        medication: 'medications',
        reproductiveHealth: 'reproductiveHealth',
        vaccination: 'vaccinations',
        healthCheck: 'healthChecks'
      };

      const endpoint = endpoints[formType];

      // Delete from backend
      axios.delete(`/api/${endpoint}/${recordToDelete._id}`)
        .then(() => {
          const updatedRecords = [...records];
          updatedRecords.splice(recordIndex, 1);
          setRecords(updatedRecords);
        })
        .catch(error => {
          console.error('Error deleting record:', error);
          alert('Failed to delete record. Please try again.');
        });
    }
  };

  // Function to start editing a record
  const startEditing = (formType, recordIndex) => {
    const originalRecord = recordStates[formType][0][recordIndex];
    setEditRowIndex(recordIndex);
    setEditingRecord(originalRecord); // Store original data
  };

  // Function to save edits for a record
  const saveEdits = (formType, recordIndex) => {
    if (recordStates[formType] && editingRecord) {
      const [records, setRecords] = recordStates[formType];
      const updatedRecord = {
        ...editingRecord,
        lastUpdated: new Date().toLocaleString(),
      };

      // Map form types to API endpoints
      const endpoints = {
        labTest: 'labTests',
        medication: 'medications',
        reproductiveHealth: 'reproductiveHealth',
        vaccination: 'vaccinations',
        healthCheck: 'healthChecks'
      };

      const endpoint = endpoints[formType];

      // Update backend
      axios.put(
        `/api/${endpoint}/${editingRecord._id}`,
        updatedRecord
      )
        .then(() => {
          const updatedRecords = [...records];
          updatedRecords[recordIndex] = updatedRecord;
          setRecords(updatedRecords);
          setEditRowIndex(null);
          setEditingRecord(null);
        })
        .catch(error => {
          console.error('Error saving edits:', error);
          alert('Failed to save changes. Please try again.');
        });
    }
  };

  return (
    <div className="health-records-screen">
      <h1 className="text-2xl font-bold bg-blue-500 p-4 rounded text-white mb-12 text-center">Health Records</h1>
      

      {/* Buttons to open forms */}
      <div className="icon-buttons">
        <button 
          onClick={() => { setActiveForm('labTest'); setActiveButton('labTest'); }} 
          className={`icon-button ${activeButton === 'labTest' ? 'active' : ''}`}
        >
          Lab Test
        </button>
        <button 
          onClick={() => { setActiveForm('medication'); setActiveButton('medication'); }} 
          className={`icon-button ${activeButton === 'medication' ? 'active' : ''}`}
        >
          Medication
        </button>
        <button 
          onClick={() => { setActiveForm('reproductiveHealth'); setActiveButton('reproductiveHealth'); }} 
          className={`icon-button ${activeButton === 'reproductiveHealth' ? 'active' : ''}`}
        >
          Reproductive Health
        </button>
        <button 
          onClick={() => { setActiveForm('vaccination'); setActiveButton('vaccination'); }} 
          className={`icon-button ${activeButton === 'vaccination' ? 'active' : ''}`}
        >
          Vaccination
        </button>
        <button 
          onClick={() => { setActiveForm('healthCheck'); setActiveButton('healthCheck'); }} 
          className={`icon-button ${activeButton === 'healthCheck' ? 'active' : ''}`}
        >
          Health Check
        </button>
      </div>

      {/* Render the selected form */}
      {activeForm && (
        <div>
          {activeForm === 'labTest' && (
            <LabTestsForm 
              onClose={handleFormClose} 
              onRecordAdded={(record) => addRecord('labTest', record)} 
            />
          )}
          {activeForm === 'medication' && (
            <MedicationAdministrationForm 
              onClose={handleFormClose} 
              onRecordAdded={(record) => addRecord('medication', record)} 
            />
          )}
          {activeForm === 'reproductiveHealth' && (
            <ReproductiveHealthForm 
              onClose={handleFormClose} 
              onRecordAdded={(record) => addRecord('reproductiveHealth', record)} 
            />
          )}
          {activeForm === 'vaccination' && (
            <VaccinationForm 
              onClose={handleFormClose} 
              onRecordAdded={(record) => addRecord('vaccination', record)} 
            />
          )}
          {activeForm === 'healthCheck' && (
            <HealthCheckForm 
              onClose={handleFormClose} 
              onRecordAdded={(record) => addRecord('healthCheck', record)} 
            />
          )}
        </div>
      )}

      {/* Display records in a table */}
      {activeForm && (
        <div className="records-table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                {activeForm === 'labTest' && (
                  <>
                    <th>Tag ID</th>
                    <th>Date</th>
                    <th>Type of Test</th>
                    <th>Results</th>
                    <th>Follow-Up Actions</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </>
                )}
                {activeForm === 'medication' && (
                  <>
                    <th>Tag ID</th>
                    <th>Date</th>
                    <th>Medication Name</th>
                    <th>Dosage</th>
                    <th>Method</th>
                    <th>Administered By</th>
                    <th>Notes</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </>
                )}
                {activeForm === 'reproductiveHealth' && (
                  <>
                    <th>Tag ID</th>
                    <th>Breeding Date</th>
                    <th>Pregnancy Check Date</th>
                    <th>Result</th>
                    <th>Calving Date</th>
                    <th>Post-Partum Health Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </>
                )}
                {activeForm === 'vaccination' && (
                  <>
                    <th>Tag ID</th>
                    <th>Date</th>
                    <th>Vaccine</th>
                    <th>Dosage</th>
                    <th>Next Due Date</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </>
                )}
                {activeForm === 'healthCheck' && (
                  <>
                    <th>Tag ID</th>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Body Condition Score</th>
                    <th>Vet Notes</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {recordStates[activeForm] &&
                recordStates[activeForm][0].map((record, index) => (
                  <tr key={index}>
                    {editRowIndex === index ? (
                      // Editable row
                      <>
                        {activeForm === 'labTest' && (
                          <>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.tagId || record.tagId}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    tagId: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.date || record.date}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    date: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.typeOfTest || record.typeOfTest}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    typeOfTest: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.results || record.results}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    results: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <textarea
                                value={editingRecord?.followUpActions || record.followUpActions}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    followUpActions: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </>
                        )}
                        {activeForm === 'medication' && (
                          <>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.tagId || record.tagId}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    tagId: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.date || record.date}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    date: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.medicationName || record.medicationName}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    medicationName: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.dosage || record.dosage}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    dosage: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.method || record.method}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    method: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.administeredBy || record.administeredBy}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    administeredBy: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <textarea
                                value={editingRecord?.notes || record.notes}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    notes: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </>
                        )}
                        {activeForm === 'reproductiveHealth' && (
                          <>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.tagId || record.tagId}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    tagId: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.breedingDate || record.breedingDate}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    breedingDate: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.pregnancyCheckDate || record.pregnancyCheckDate}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    pregnancyCheckDate: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.result || record.result}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    result: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.calvingDate || record.calvingDate}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    calvingDate: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <textarea
                                value={editingRecord?.postPartumHealthStatus || record.postPartumHealthStatus}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    postPartumHealthStatus: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </>
                        )}
                        {activeForm === 'vaccination' && (
                          <>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.tagId || record.tagId}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    tagId: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.date || record.date}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    date: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.vaccine || record.vaccine}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    vaccine: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.dosage || record.dosage}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    dosage: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.nextDueDate || record.nextDueDate}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    nextDueDate: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </>
                        )}
                        {activeForm === 'healthCheck' && (
                          <>
                            <td>
                              <input
                                type="text"
                                value={editingRecord?.tagId || record.tagId}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    tagId: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={editingRecord?.date || record.date}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    date: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={editingRecord?.weight || record.weight}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    weight: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                step="0.1"
                                value={editingRecord?.bodyConditionScore || record.bodyConditionScore}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    bodyConditionScore: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <textarea
                                value={editingRecord?.vetNotes || record.vetNotes}
                                onChange={(e) => 
                                  setEditingRecord({
                                    ...editingRecord,
                                    vetNotes: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </>
                        )}
                        <td>
                          {editingRecord ? new Date().toLocaleString() : record.lastUpdated}
                        </td>
                        <td>
                          <div className="button-group">
                            <button onClick={() => saveEdits(activeForm, index)} className="submit-button">Save</button>
                            <button onClick={() => {
                              setEditRowIndex(null);
                              setEditingRecord(null); // Reset on Cancel
                            }} className="cancel-button">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Non-editable row
                      <>
                        {activeForm === 'labTest' && (
                          <>
                            <td>{record.tagId}</td>
                            <td>{record.date}</td>
                            <td>{record.typeOfTest}</td>
                            <td>{record.results}</td>
                            <td>{record.followUpActions}</td>
                          </>
                        )}
                        {activeForm === 'medication' && (
                          <>
                            <td>{record.tagId}</td>
                            <td>{record.date}</td>
                            <td>{record.medicationName}</td>
                            <td>{record.dosage}</td>
                            <td>{record.method}</td>
                            <td>{record.administeredBy}</td>
                            <td>{record.notes}</td>
                          </>
                        )}
                        {activeForm === 'reproductiveHealth' && (
                          <>
                            <td>{record.tagId}</td>
                            <td>{record.breedingDate}</td>
                            <td>{record.pregnancyCheckDate}</td>
                            <td>{record.result}</td>
                            <td>{record.calvingDate}</td>
                            <td>{record.postPartumHealthStatus}</td>
                          </>
                        )}
                        {activeForm === 'vaccination' && (
                          <>
                            <td>{record.tagId}</td>
                            <td>{record.date}</td>
                            <td>{record.vaccine}</td>
                            <td>{record.dosage}</td>
                            <td>{record.nextDueDate}</td>
                          </>
                        )}
                        {activeForm === 'healthCheck' && (
                          <>
                            <td>{record.tagId}</td>
                            <td>{record.date}</td>
                            <td>{record.weight}</td>
                            <td>{record.bodyConditionScore}</td>
                            <td>{record.vetNotes}</td>
                          </>
                        )}
                        <td>{record.lastUpdated}</td>
                        <td>
                          <div className="button-group">
                            <button onClick={() => startEditing(activeForm, index)} className="edit-button">Edit</button>
                            <button onClick={() => deleteRecord(activeForm, index)} className="delete-button">Delete</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HealthRecordsScreen;