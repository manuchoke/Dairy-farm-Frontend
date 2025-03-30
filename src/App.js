import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Import components
import Navbar from './components/dashboard/Navbar';
import Sidebar from './components/dashboard/Sidebar';
import Dashboard from './components/dashboard/dashboard';
import AnimalsPage from './components/animals/animalsPage';
import FeedManagement from './components/FeedManagement';
import MilkProduction from './components/milkProduction/milkProduction';
import HealthRecordsScreen from './components/healthRecords/healthRecordsScreen';
import SalesScreen from './components/sales/salesScreen';
import DairyNewsReports from './components/dairyNews/DairyNewsReports';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Footer from './components/Footer';
import UserProfile from './components/auth/UserProfile';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import GeminiAI from './components/chat/GeminiAI';

// Public route wrapper
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Private route wrapper
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Layout wrapper
const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar className="fixed top-0 w-full z-50" />
    <div className="flex flex-1 pt-16">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer className="w-full" />
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/animals" element={<AnimalsPage />} />
              <Route path="/milk-production" element={<MilkProduction />} />
              <Route path="/feed-management" element={<FeedManagement />} />
              <Route path="/health-records" element={<HealthRecordsScreen />} />
              <Route path="/sales" element={<SalesScreen />} />
              <Route path="/dairy-news-reports" element={<DairyNewsReports />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/gemini" element={<GeminiAI />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
