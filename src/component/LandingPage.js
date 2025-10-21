//this is for the landing page
import { useState } from 'react';

const LandingPage = ({ language, onLoginClick, onSignupClick }) => {
  const content = {
    en: {
      title: 'Healthcare Portal',
      subtitle: 'Your health, our priority',
      login: 'Log In',
      signup: 'Sign Up',
      description: 'Access your medical records and healthcare services'
    },
    tl: {
      title: 'Health Portal',
      subtitle: 'Ang iyong kalusugan, aming prayoridad',
      login: 'Mag-login',
      signup: 'Mag-sign Up',
      description: 'I-access ang iyong mga medical records at mga serbisyong pangkalusugan'
    }
  };

  const text = content[language];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-light text-gray-800 mb-2">{text.title}</h1>
          <p className="text-gray-500 mb-8">{text.subtitle}</p>
          <p className="text-sm text-gray-400">{text.description}</p>
        </div>

        <div className="space-y-4">
          <button onClick={onLoginClick}
            className="w-full py-4 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-lg font-medium"
          >
            {text.login}
          </button>
          
          <button onClick={onSignupClick}
            className="w-full py-4 px-6 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors duration-200 text-lg font-medium"
          >
            {text.signup}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {language === 'en' ? 'Change Language' : 'Baguhin ang Wika'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;