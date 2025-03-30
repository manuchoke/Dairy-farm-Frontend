import { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    farmName: '',
    address: '',
    numberOfCattle: '',
    farmSize: {
      value: '',
      unit: 'Acres'
    },
    createdAt: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get('/api/auth/profile');

      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error('Session expired. Please login again');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            break;
          
          case 403:
            if (error.response.data.message.includes('verify your email')) {
              toast.error('Please verify your email first');
              const user = JSON.parse(localStorage.getItem('user'));
              if (user?.email) {
                navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
              } else {
                navigate('/login');
              }
            } else {
              toast.error('Access denied');
              navigate('/login');
            }
            break;
          
          default:
            toast.error(error.response.data.message || 'Failed to fetch profile data');
        }
      } else {
        toast.error('Network error. Please try again later');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('/api/auth/profile', {
        ...userData
      });

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete('/api/auth/delete-account');

      if (response.data.success) {
        localStorage.clear();
        
        toast.success('Account deleted successfully');
        
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">Error loading profile data</div>
      </div>
    );
  }

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto border border-gray-300 rounded-lg bg-white shadow-md p-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-black-900">
              Farm Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-black-500">
              Personal and farm details
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isEditing ? 'View Profile' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-black-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={userData.firstName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ''}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userData.phoneNumber || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700">Farm Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={userData.farmName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={userData.address || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700">Farm Size (acres)</label>
                <input
                  type="number"
                  name="farmSize"
                  value={userData.farmSize?.value || ''}
                  onChange={(e) => {
                    setUserData(prev => ({
                      ...prev,
                      farmSize: {
                        ...prev.farmSize,
                        value: e.target.value
                      }
                    }));
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                  <label className="block text-sm font-medium text-black-700">Number of Cattle</label>
                <input
                  type="number"
                  name="numberOfCattle"
                  value={userData.numberOfCattle || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-red-600 hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black-500">Full name</dt>
                <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                  {userData.firstName} {userData.lastName}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black-500">Email address</dt>
                <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                  {userData.email}
                </dd>
              </div>

              {userData.phoneNumber && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-black-500">Phone number</dt>
                  <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                    {userData.phoneNumber}
                  </dd>
                </div>
              )}

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black-500">Farm name</dt>
                <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                  {userData.farmName}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black-500">Farm address</dt>
                  <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                  {userData.address}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black-500">Farm size</dt>
                  <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                  {userData.farmSize?.value || 0} {userData.farmSize?.unit || 'Acres'}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black-500">Number of cattle</dt>
                <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                  {userData.numberOfCattle}
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-black-500">Member since</dt>
                <dd className="mt-1 text-sm text-black-900 sm:mt-0 sm:col-span-2">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>

      {showDeleteConfirm && <DeleteConfirmationModal />}
    </div>
  );
};

export default UserProfile; 