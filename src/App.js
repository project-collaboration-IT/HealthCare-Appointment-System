//this is the brain, it is used to show which page kayo right now
//nothing to change in the UI here, pero may someting to read sa baba so go ahead
//UPDATED: Now saves user session so refresh doesn't log you out!

import { useState, useEffect } from 'react';
import LanguageSelection from './component/LanguageSelection';
import LandingPage from './component/LandingPage';
import Login from './component/Login';
import Signup from './component/Signup';
import Dashboard from './component/Dashboard';
import AdminPanel from './component/AdminPanel';

export default function App() {
  // Initialize states from localStorage if available
  // localStorage.getItem() retrieves saved data from browser
  // JSON.parse() converts the saved string back to an object
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || null;
  });
  
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || 'languageSelection';
  });
  
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // NEW: useEffect to save state to localStorage whenever it changes
  // This runs every time selectedLanguage, currentView, or userData changes
  useEffect(() => {
    // Save language preference
    if (selectedLanguage) {
      localStorage.setItem('selectedLanguage', selectedLanguage);
    } else {
      localStorage.removeItem('selectedLanguage');
    }
  }, [selectedLanguage]); // Runs when selectedLanguage changes

  useEffect(() => {
    // Save current view
    localStorage.setItem('currentView', currentView);
  }, [currentView]); // Runs when currentView changes

  useEffect(() => {
    // Save user data
    if (userData) {
      // Convert userData object to string and save
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData');
    }
  }, [userData]); // Runs when userData changes

  const handleLogin = (data) => {
    setUserData(data);
    setCurrentView('dashboard');
  };

  const handleSignup = (data) => {
    setUserData(data);
    setCurrentView('dashboard');
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setCurrentView('landing');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleSignupClick = () => {
    setCurrentView('signup');
  };

    // NEW: Handle logout - clears all saved data
  const handleLogout = () => {
    console.log('Logging out...'); // Debug log
    
    // Clear all localStorage data
    localStorage.removeItem('userData');
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('currentView');
    
    // Reset all states
    setUserData(null);
    setSelectedLanguage(null);
    setCurrentView('languageSelection');
    
    console.log('Logout complete'); // Debug log
  };

  // Show Dashboard
  if (currentView === 'dashboard') {
    return <Dashboard 
      language={selectedLanguage} 
      userData={userData} 
      onLogout={handleLogout}  // Pass logout handler
    />;
  }

  // Show Login Form
  if (currentView === 'login') {
    return <Login language={selectedLanguage} onLogin={handleLogin} />;
  }

  // Show Signup Form
  if (currentView === 'signup') {
    return <Signup language={selectedLanguage} onSignup={handleSignup} />;
  }

  // Show Landing Page (Login/Signup options)
  if (currentView === 'landing') {
    return (
      <LandingPage 
        language={selectedLanguage} 
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
      />
    );
  }

  // ito yung kung saan magloloading si page sa unang refersh
  // change this to "AdminPanel" para makita or ma-test yung database
  return <LanguageSelection onSelectLanguage={handleLanguageSelect} />;
}