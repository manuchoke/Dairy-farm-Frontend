import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Verify token with backend
        const response = await axios.get("/api/auth/verify");
        setUser(response.data);
      }
    } catch (err) {
      console.error('Auth status check error:', err);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Attempting login with:', { email });
      
      const res = await axios.post("/api/auth/login", { 
        email, 
        password 
      });

      console.log('Login response:', res.data);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        code: err.code,
        response: err.response,
        config: err.config
      });

      if (!err.response) {
        // Network error
        if (err.code === 'ECONNABORTED') {
          setError('Request timeout. Please try again.');
        } else {
          setError('Network error. Please check your connection and try again.');
        }
      } else {
        // Server error
        switch (err.response.status) {
          case 401:
            setError('Invalid email or password');
            break;
          case 403:
            setError('Please verify your email before logging in');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(err.response?.data?.message || "Login failed");
        }
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Attempting registration with:', { email });
      
      const res = await axios.post("/api/auth/register", { 
        email, 
        password 
      });

      console.log('Registration response:', res.data);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Registration error details:', {
        message: err.message,
        code: err.code,
        response: err.response,
        config: err.config
      });

      if (!err.response) {
        // Network error
        if (err.code === 'ECONNABORTED') {
          setError('Request timeout. Please try again.');
        } else {
          setError('Network error. Please check your connection and try again.');
        }
      } else {
        // Server error
        switch (err.response.status) {
          case 400:
            setError(err.response?.data?.message || 'Invalid registration data');
            break;
          case 409:
            setError('Email already registered');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(err.response?.data?.message || "Registration failed");
        }
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setError(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      loading, 
      error,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);