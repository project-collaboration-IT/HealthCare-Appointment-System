// Signup Component
//same with login, these may not work yet pero feel free to read or re-design 
import { useState } from 'react';
import { signup } from '../utils/api';

const Signup = ({ language, onSignup, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    barangay: '',
    number: '',
    password: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const content = {
    en: {
      title: 'Create Account',
      firstName: 'First Name',
      lastName: 'Last Name',
      age: 'Age',
      barangay: 'Barangay Address',
      number: 'Phone Number',
      password: 'Password',
      signupBtn: 'Sign Up',
      backBtn: 'Back',
      confirmTitle: 'Confirm Your Information',
      confirmMsg: 'Please review your information carefully:',
      credentialsReminder: 'Remember these credentials for logging in:',
      loginName: 'Login Name',
      confirmBtn: 'Confirm & Continue',
      editBtn: 'Edit Information',
      required: 'This field is required',
      invalidPhone: 'Enter a valid 11-digit phone number'
    },
    tl: {
      title: 'Gumawa ng Account',
      firstName: 'Pangalan',
      lastName: 'Apelyido',
      age: 'Edad',
      barangay: 'Address ng Barangay',
      number: 'Numero ng Telepono',
      password: 'Password',
      signupBtn: 'Mag-sign Up',
      backBtn: 'Bumalik',
      confirmTitle: 'Kumpirmahin ang Iyong Impormasyon',
      confirmMsg: 'Pakiusap suriin ang inyong impormasyon:',
      credentialsReminder: 'Tandaan ang mga credentials na ito para sa pag-login:',
      loginName: 'Pangalan sa Pag-login',
      confirmBtn: 'Kumpirmahin at Magpatuloy',
      editBtn: 'Baguhin ang Impormasyon',
      required: 'Kinakailangan ang field na ito',
      invalidPhone: 'Maglagay ng wastong 11-digit na numero'
    }
  };

  const text = content[language];

  // Helpers for number validation
  const extractDigits = (value) => (value || '').replace(/\D/g, '');

  //form validation sa signup, familiar na kau here
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = text.required;
    if (!formData.lastName.trim()) newErrors.lastName = text.required;
    if (!formData.age.trim()) newErrors.age = text.required;
    if (!formData.barangay.trim()) newErrors.barangay = text.required;
    const digits = extractDigits(formData.number);
    if (!formData.number.trim()) {
      newErrors.number = text.required;
    } else if (digits.length !== 11) {
      newErrors.number = text.invalidPhone;
    }
    if (!formData.password.trim()) newErrors.password = text.required;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  //dito nangyayari ang himala, kapag pinindot si confirm & continue button
  const handleConfirm = async () => {
    console.log('handleConfirm called'); // Debug log
    setError('');
    setIsLoading(true);

    try {
      const digits = extractDigits(formData.number);
      console.log('Calling signup API with:', { ...formData, number: digits }); // Debug log
      const response = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        barangay: formData.barangay,
        number: digits,
        password: formData.password
      });

      console.log('Signup response:', response); // Debug log

      if (response.success) {
        console.log('Signup successful, calling onSignup with:', response.user); // Debug log
        // Pass the user data to parent component
        onSignup(response.user);
      } else {
        setError('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error); // Debug log
      setError(error.message || 'An error occurred during signup');
      // Stay on confirmation screen to show error
    } finally {
      setIsLoading(false);
    }
  };
      //from here on, left side si information review
      //right side si credentials to remember and back/continue buttons
  if (showConfirmation) {
    return (
      <div className="bg-white min-h-screen lg:h-screen w-full p-4 lg:p-8">
        <div className="h-full w-full flex flex-col lg:flex-row gap-6">
          {/* Left: Information Overview */}
          <div className="flex-1 bg-green-50 border-2 border-green-500 rounded-lg p-6 overflow-y-auto">
            <div className="text-center lg:text-left mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto lg:mx-0 mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-800 mb-2">{text.confirmTitle}</h2>
              <p className="text-sm text-gray-600">{text.confirmMsg}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <div className="bg-white p-3 rounded border border-green-200 md:col-span-2">
                <p className="text-xs text-gray-500">{text.number}</p>
                <p className="text-gray-800">{formData.number}</p>
              </div>
            </div>
          </div>

          {/* Right: Credentials + Actions */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <div className="h-full bg-white border-2 border-yellow-300 rounded-lg p-6 flex flex-col">
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                <p className="text-base md:text-lg font-medium text-gray-800 mb-2">⚠️ {text.credentialsReminder}</p>
                <div className="space-y-1">
                  <p className="text-base md:text-lg text-gray-700"><strong>{text.loginName}:</strong> {formData.firstName} {formData.lastName}</p>
                  <p className="text-base md:text-lg text-gray-700"><strong>{text.barangay}:</strong> {formData.barangay}</p>
                  <p className="text-base md:text-lg text-gray-700"><strong>{text.password}:</strong> {formData.password}</p>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                {error && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`w-full py-3 text-white rounded-lg transition-colors ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isLoading ? 'Creating Account...' : text.confirmBtn}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isLoading}
                  className="w-full py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {text.editBtn}
                </button>
              </div>
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
              placeholder="Juan"
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
              placeholder="Dela Cruz"
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
              placeholder="30"
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
              placeholder="123 Barangay Street, Paco"
              value={formData.barangay}
              onChange={(e) => setFormData({...formData, barangay: e.target.value})}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.barangay ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.barangay && <p className="text-red-500 text-xs mt-1">{errors.barangay}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">{text.number}</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="0912-345-6789"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-green-500 ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
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
          onClick={onBack}
          className="w-full mt-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {text.backBtn}
        </button>
      </div>
    </div>
  );
};

export default Signup;