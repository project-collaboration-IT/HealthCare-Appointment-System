//for the log in naman ito
// most of these may not work yet kasi sira pa si database, but feel free to read
import { useState } from 'react';
import { login } from '../utils/api';

//ito ung mga hihingin, change it kung needed
const Login = ({ language, onLogin, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    barangay: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      title: 'Welcome Back',
      firstName: 'First Name',
      barangay: 'Barangay Address',
      password: 'Password',
      loginBtn: 'Log In',
      backBtn: 'Back',
      loggingIn: 'Logging in...'
    },
    tl: {
      title: 'Maligayang Pagbabalik',
      firstName: 'Pangalan',
      barangay: 'Address ng Barangay',
      password: 'Password',
      loginBtn: 'Mag-login',
      backBtn: 'Bumalik',
      loggingIn: 'Nag-lo-login...'
    }
  };

  const text = content[language];

  const handleSubmit = async () => {
    // Clear previous errors
    setError('');
    
    // Validate input
    if (!formData.firstName.trim() || !formData.barangay.trim() || !formData.password.trim()) {
      setError(language === 'en' ? 'Please fill in all fields' : 'Pakipunan ang lahat ng fields');
      return;
    }

    // Show loading state
    setIsLoading(true);

    try {
      // Call login API
      const response = await login({
        firstName: formData.firstName,
        barangay: formData.barangay,
        password: formData.password
      });

      // If successful, pass user data to parent component
      if (response.success) {
        onLogin(response.user);
      }
    } catch (error) {
      // Display error message from backend
      setError(error.message);
    } finally {
      // Hide loading state
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-gray-800">{text.title}</h1>
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.firstName}</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.barangay}</label>
            <input
              type="text"
              value={formData.barangay}
              onChange={(e) => setFormData({...formData, barangay: e.target.value})}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.password}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 disabled:bg-gray-100"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isLoading ? text.loggingIn : text.loginBtn}
          </button>
        </div>

            <button
              onClick={onBack}
              disabled={isLoading}
              className="w-full mt-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {text.backBtn}
            </button>
        
      </div>
    </div>
  );
};

export default Login;