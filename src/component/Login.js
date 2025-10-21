<<<<<<< HEAD
import { useState } from 'react';

// Login Component
const Login = ({ language, onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    password: ''
  });

  const content = {
    en: {
      title: 'Welcome Back',
      firstName: 'First Name',
      password: 'Password',
      loginBtn: 'Log In',
      backBtn: 'Back'
    },
    tl: {
      title: 'Maligayang Pagbabalik',
      firstName: 'Pangalan',
      password: 'Password',
      loginBtn: 'Mag-login',
      backBtn: 'Bumalik'
    }
  };

  const text = content[language];

  const handleSubmit = () => {
    onLogin({ firstName: formData.firstName || 'User' });
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.firstName}</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.password}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {text.loginBtn}
          </button>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full mt-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {text.backBtn}
        </button>
      </div>
    </div>
  );
};
=======
import { useState } from 'react';

// Login Component
const Login = ({ language, onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    password: ''
  });

  const content = {
    en: {
      title: 'Welcome Back',
      firstName: 'First Name',
      password: 'Password',
      loginBtn: 'Log In',
      backBtn: 'Back'
    },
    tl: {
      title: 'Maligayang Pagbabalik',
      firstName: 'Pangalan',
      password: 'Password',
      loginBtn: 'Mag-login',
      backBtn: 'Bumalik'
    }
  };

  const text = content[language];

  const handleSubmit = () => {
    onLogin({ firstName: formData.firstName || 'User' });
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.firstName}</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.password}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {text.loginBtn}
          </button>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full mt-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {text.backBtn}
        </button>
      </div>
    </div>
  );
};
>>>>>>> 497ae21 (	new file:   .gitignore)
export default Login;