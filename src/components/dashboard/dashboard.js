import React from 'react';
import Sidebar from './Sidebar';
import AnimalsPage from '../animals/animalsPage';

const Dashboard = () => {
 

  // Determine if the current route matches the Animals page
  
  return (
    <div className="flex">
      <Sidebar />
      <div>
      <AnimalsPage />
      </div>
    </div>
  );
};

export default Dashboard;