<<<<<<< HEAD
//this is for the language selection page
import { useState } from 'react';
const LanguageSelection = ({ onSelectLanguage }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-500">Please select your preferred language</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectLanguage('en')}
            className="w-full py-4 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-lg font-medium"
          >
            English
          </button>
          
          <button
            onClick={() => onSelectLanguage('tl')}
            className="w-full py-4 px-6 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors duration-200 text-lg font-medium"
          >
            Tagalog
          </button>
        </div>
      </div>
    </div>
  );
};
=======
//this is for the language selection page
import { useState } from 'react';
const LanguageSelection = ({ onSelectLanguage }) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-500">Please select your preferred language</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelectLanguage('en')}
            className="w-full py-4 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-lg font-medium"
          >
            English
          </button>
          
          <button
            onClick={() => onSelectLanguage('tl')}
            className="w-full py-4 px-6 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors duration-200 text-lg font-medium"
          >
            Tagalog
          </button>
        </div>
      </div>
    </div>
  );
};
>>>>>>> 497ae21 (	new file:   .gitignore)
export default LanguageSelection;