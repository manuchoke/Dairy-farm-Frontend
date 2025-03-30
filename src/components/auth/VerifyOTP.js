import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../../utils/axios';

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: email.toLowerCase().trim(),
        otp
      });

      if (response.data.success) {
        toast.success('OTP verified successfully');
        navigate(`/reset-password?token=${response.data.token}`);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to verify OTP');
      } else {
        toast.error('Network error. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/resend-otp', {
        email: email.toLowerCase().trim()
      });

      if (response.data.success) {
        toast.success('New OTP has been sent to your email');
        setTimeLeft(300); // Reset timer
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      if (error.response) {
        toast.error(error.response.data?.message || 'Failed to resend OTP');
      } else {
        toast.error('Network error. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 border border-gray-300 rounded-lg bg-white shadow-md p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-6">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to {email}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 6) {
                  setOtp(value);
                }
              }}
              maxLength={6}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading || otp.length !== 6
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP; 