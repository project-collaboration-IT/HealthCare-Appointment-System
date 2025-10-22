//this is the brain, it is used to show which page kayo right now
//nothing to change in the UI here, pero may someting to read sa baba so go ahead

import { useState } from 'react';
import LanguageSelection from './component/LanguageSelection';
import LandingPage from './component/LandingPage';
import Login from './component/Login';
import Signup from './component/Signup';
import Dashboard from './component/Dashboard';
import AdminPanel from './component/AdminPanel';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentView, setCurrentView] = useState('languageSelection');
  const [userData, setUserData] = useState(null);

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

  // Show Dashboard
  if (currentView === 'dashboard') {
    return <Dashboard language={selectedLanguage} userData={userData} />;
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
  //change this to "AdminPanel" para makita or ma-test yung database
  return <LanguageSelection onSelectLanguage={handleLanguageSelect} />;
}