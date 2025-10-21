<<<<<<< HEAD
// Signup Component
import { useState } from 'react';
const Signup = ({ language, onSignup }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    barangay: '',
    password: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const content = {
    en: {
      title: 'Create Account',
      firstName: 'First Name',
      lastName: 'Last Name',
      age: 'Age',
      barangay: 'Barangay Address',
      password: 'Password',
      signupBtn: 'Sign Up',
      backBtn: 'Back',
      confirmTitle: 'Confirm Your Information',
      confirmMsg: 'Please review your information carefully:',
      credentialsReminder: 'Remember these credentials for logging in:',
      loginName: 'Login Name',
      confirmBtn: 'Confirm & Continue',
      editBtn: 'Edit Information',
      required: 'This field is required'
    },
    tl: {
      title: 'Gumawa ng Account',
      firstName: 'Pangalan',
      lastName: 'Apelyido',
      age: 'Edad',
      barangay: 'Address ng Barangay',
      password: 'Password',
      signupBtn: 'Mag-sign Up',
      backBtn: 'Bumalik',
      confirmTitle: 'Kumpirmahin ang Iyong Impormasyon',
      confirmMsg: 'Pakiusap suriin ang inyong impormasyon:',
      credentialsReminder: 'Tandaan ang mga credentials na ito para sa pag-login:',
      loginName: 'Pangalan sa Pag-login',
      confirmBtn: 'Kumpirmahin at Magpatuloy',
      editBtn: 'Baguhin ang Impormasyon',
      required: 'Kinakailangan ang field na ito'
    }
  };

  const text = content[language];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = text.required;
    if (!formData.lastName.trim()) newErrors.lastName = text.required;
    if (!formData.age.trim()) newErrors.age = text.required;
    if (!formData.barangay.trim()) newErrors.barangay = text.required;
    if (!formData.password.trim()) newErrors.password = text.required;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    onSignup(formData);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-800 mb-2">{text.confirmTitle}</h2>
              <p className="text-sm text-gray-600">{text.confirmMsg}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.firstName}</p>
                <p className="text-gray-800">{formData.firstName}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.lastName}</p>
                <p className="text-gray-800">{formData.lastName}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.age}</p>
                <p className="text-gray-800">{formData.age}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.barangay}</p>
                <p className="text-gray-800">{formData.barangay}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
              <p className="text-base md:text-lg font-medium text-gray-800 mb-2">⚠️ {text.credentialsReminder}</p>
              <div className="space-y-1">
                <p className="text-base md:text-lg text-gray-700"><strong>{text.loginName}:</strong> {formData.firstName}</p>
                <p className="text-base md:text-lg text-gray-700"><strong>{text.password}:</strong> {formData.password}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {text.confirmBtn}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {text.editBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.lastName}</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.age}</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.barangay}</label>
            <input
              type="text"
              value={formData.barangay}
              onChange={(e) => setFormData({...formData, barangay: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.barangay ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.password}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {text.signupBtn}
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
// Signup Component
import { useState } from 'react';
const Signup = ({ language, onSignup }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    barangay: '',
    password: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const content = {
    en: {
      title: 'Create Account',
      firstName: 'First Name',
      lastName: 'Last Name',
      age: 'Age',
      barangay: 'Barangay Address',
      password: 'Password',
      signupBtn: 'Sign Up',
      backBtn: 'Back',
      confirmTitle: 'Confirm Your Information',
      confirmMsg: 'Please review your information carefully:',
      credentialsReminder: 'Remember these credentials for logging in:',
      loginName: 'Login Name',
      confirmBtn: 'Confirm & Continue',
      editBtn: 'Edit Information',
      required: 'This field is required'
    },
    tl: {
      title: 'Gumawa ng Account',
      firstName: 'Pangalan',
      lastName: 'Apelyido',
      age: 'Edad',
      barangay: 'Address ng Barangay',
      password: 'Password',
      signupBtn: 'Mag-sign Up',
      backBtn: 'Bumalik',
      confirmTitle: 'Kumpirmahin ang Iyong Impormasyon',
      confirmMsg: 'Pakiusap suriin ang inyong impormasyon:',
      credentialsReminder: 'Tandaan ang mga credentials na ito para sa pag-login:',
      loginName: 'Pangalan sa Pag-login',
      confirmBtn: 'Kumpirmahin at Magpatuloy',
      editBtn: 'Baguhin ang Impormasyon',
      required: 'Kinakailangan ang field na ito'
    }
  };

  const text = content[language];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = text.required;
    if (!formData.lastName.trim()) newErrors.lastName = text.required;
    if (!formData.age.trim()) newErrors.age = text.required;
    if (!formData.barangay.trim()) newErrors.barangay = text.required;
    if (!formData.password.trim()) newErrors.password = text.required;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    onSignup(formData);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-800 mb-2">{text.confirmTitle}</h2>
              <p className="text-sm text-gray-600">{text.confirmMsg}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.firstName}</p>
                <p className="text-gray-800">{formData.firstName}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.lastName}</p>
                <p className="text-gray-800">{formData.lastName}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.age}</p>
                <p className="text-gray-800">{formData.age}</p>
              </div>
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-gray-500">{text.barangay}</p>
                <p className="text-gray-800">{formData.barangay}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
              <p className="text-base md:text-lg font-medium text-gray-800 mb-2">⚠️ {text.credentialsReminder}</p>
              <div className="space-y-1">
                <p className="text-base md:text-lg text-gray-700"><strong>{text.loginName}:</strong> {formData.firstName}</p>
                <p className="text-base md:text-lg text-gray-700"><strong>{text.password}:</strong> {formData.password}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {text.confirmBtn}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {text.editBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.lastName}</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.age}</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.barangay}</label>
            <input
              type="text"
              value={formData.barangay}
              onChange={(e) => setFormData({...formData, barangay: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.barangay ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.password}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {text.signupBtn}
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
export default Signup;