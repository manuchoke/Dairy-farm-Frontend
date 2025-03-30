import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import './styles/sidebar.css'; // Import the external CSS file

const Sidebar = () => {
  return (
    <aside className="sidebar w-64 bg-gray-800 text-white h-screen p-4">
      <ul>
        <li className="my-4">
          <NavLink
            to="/animals"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Animals
          </NavLink>
        </li>
        <li className="my-4">
          <NavLink
            to="/milk-Production"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Milk Production
          </NavLink>
        </li>
        

        <li className="my-4">
          <NavLink
            to="/feed-management"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Feed Management
          </NavLink>
        </li>


        <li className="my-4">
          <NavLink
            to="/health-records"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Health Records
          </NavLink>
        </li>
        <li className="my-4">
          <NavLink
            to="/sales"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Sales
          </NavLink>
        </li>
        <li className="my-4">
          <NavLink
            to="/dairy-news-reports"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Dairy News and Reports
          </NavLink>
        </li>
        <li className="my-4">
          <NavLink
            to="/gemini"
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Dairy Chat AI
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
