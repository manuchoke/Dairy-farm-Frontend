import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from '../../utils/axios';
import PasswordInput from '../common/PasswordInput';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [address, setAddress] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [numberOfCattle, setNumberOfCattle] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!farmName) errors.farmName = 'Farm name is required';
    if (!address) errors.address = 'Address is required';
    if (!farmSize) errors.farmSize = 'Farm size is required';
    if (!numberOfCattle) errors.numberOfCattle = 'Number of cattle is required';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    
    // Validate email format
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (password && !validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters long and contain uppercase, lowercase, and numbers';
    }
    
    // Validate password match
    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate farm size
    if (farmSize && (isNaN(Number(farmSize)) || Number(farmSize) <= 0)) {
      errors.farmSize = 'Farm size must be greater than 0';
    }
    
    // Validate number of cattle
    if (numberOfCattle && (isNaN(Number(numberOfCattle)) || Number(numberOfCattle) <= 0)) {
      errors.numberOfCattle = 'Number of cattle must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show specific error messages instead of generic message
      Object.values(formErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    setLoading(true);
    
    const registrationData = {
      email: email.toLowerCase().trim(),
      password,
      firstName,
      lastName,
      farmName,
      address,
      farmSize: {
        value: Number(farmSize),
        unit: 'Acres'
      },
      numberOfCattle: Number(numberOfCattle)
    };

    try {
      const response = await axios.post('/api/auth/register', registrationData);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'farmName') setFarmName(value);
    if (name === 'address') setAddress(value);
    if (name === 'farmSize') setFarmSize(value);
    if (name === 'numberOfCattle') setNumberOfCattle(value);
    if (name === 'confirmPassword') setConfirmPassword(value);

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black">
                Password
              </label>
              <div className="mt-1">
                <PasswordInput
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                Confirm Password
              </label>
              <div className="mt-1">
                <PasswordInput
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* First Name Input */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-black">
                First Name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={firstName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Last Name Input */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-black">
                Last Name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Farm Name Input */}
            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-black">
                Farm Name
              </label>
              <div className="mt-1">
                <input
                  id="farmName"
                  name="farmName"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={farmName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-black">
                Farm Address
              </label>
              <div className="mt-1">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Farm Size Input */}
            <div>
              <label className="block text-sm font-medium text-black">Farm Size (acres)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                  formErrors.farmSize ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter farm size"
              />
              {formErrors.farmSize && (
                <p className="mt-1 text-sm text-red-500">{formErrors.farmSize}</p>
              )}
            </div>

            {/* Number of Cattle Input */}
            <div>
              <label className="block text-sm font-medium text-black">Number of Cattle</label>
              <input
                type="number"
                min="0"
                step="1"
                value={numberOfCattle}
                onChange={(e) => setNumberOfCattle(e.target.value)}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                  formErrors.numberOfCattle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter number of cattle"
              />
              {formErrors.numberOfCattle && (
                <p className="mt-1 text-sm text-red-500">{formErrors.numberOfCattle}</p>
              )}
            </div>

            {/* Password Match Error Message */}
            {password && confirmPassword && password !== confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                Passwords do not match
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;