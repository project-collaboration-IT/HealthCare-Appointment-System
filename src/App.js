import { useState } from 'react';
import LanguageSelection from './component/LanguageSelection';
import LandingPage from './component/LandingPage';
import Login from './component/Login';
import Signup from './component/Signup';
import Dashboard from './component/Dashboard';

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

  // Show Language Selection (default first screen)
  return <LanguageSelection onSelectLanguage={handleLanguageSelect} />;
}