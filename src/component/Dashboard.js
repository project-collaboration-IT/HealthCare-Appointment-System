//ito pinakamahaba omfg sobra talaga

import { useState } from 'react';
import AppointmentScheduler from './AppointmentScheduler';

//daming initialization 'no
const Dashboard = ({ language, userData }) => {
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScheduler, setShowScheduler] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  //haba rin nito, 'di ako makaisip ng other way para maimprove ito
  const content = {
    en: {
      welcome: 'Welcome',
      accountInfo: 'Account Information',
      settings: 'Settings',
      closeBtn: 'Close',
      accountTitle: 'Your Account Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      age: 'Age',
      address: 'Address',
      settingsTitle: 'Settings',
      themeLabel: 'Theme',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      contact: 'Contact Us',
      logout: 'Log Out',
      contactTitle: 'Health Center Contact Information',
      healthCenter: 'Barangay Health Center',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      newsTitle: 'News and Announcements',
      scheduleBtn: 'Schedule an Appointment',
      appointmentSummary: 'Summary of Existing Appointment',
      noAppointment: 'No appointment scheduled',
      scheduleNow: 'Schedule Now',
      viewDetails: 'View Details',
      appointmentDetails: 'Appointment Details',
      symptoms: 'Symptoms',
      recentMeals: 'Recent Meals',
      medications: 'Medications',
      appointmentDate: 'Appointment Date',
      appointmentTime: 'Appointment Time',
      status: 'Status',
      editAppointment: 'Edit Appointment',
      deleteAppointment: 'Delete Appointment',
      confirmDelete: 'Are you sure you want to delete this appointment?',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      saveChanges: 'Save Changes'
    },
    tl: {
      welcome: 'Maligayang Pagdating',
      accountInfo: 'Impormasyon ng Account',
      settings: 'Mga Setting',
      closeBtn: 'Isara',
      accountTitle: 'Iyong Impormasyon ng Account',
      firstName: 'Pangalan',
      lastName: 'Apelyido',
      age: 'Edad',
      address: 'Address',
      settingsTitle: 'Mga Setting',
      themeLabel: 'Tema',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      contact: 'Makipag-ugnayan',
      logout: 'Mag-logout',
      contactTitle: 'Impormasyon ng Health Center',
      healthCenter: 'Barangay Health Center',
      addressLabel: 'Address',
      phoneLabel: 'Telepono',
      emailLabel: 'Email',
      newsTitle: 'Balita at Mga Patalastas',
      scheduleBtn: 'Mag-iskedyul ng Appointment',
      appointmentSummary: 'Buod ng Kasalukuyang Appointment',
      noAppointment: 'Walang naka-iskedyul na appointment',
      scheduleNow: 'Mag-iskedyul Ngayon',
      viewDetails: 'Tingnan ang Detalye',
      appointmentDetails: 'Detalye ng Appointment',
      symptoms: 'Mga Sintomas',
      recentMeals: 'Mga Kinain Kamakailan',
      medications: 'Mga Gamot',
      appointmentDate: 'Petsa ng Appointment',
      appointmentTime: 'Oras ng Appointment',
      status: 'Status',
      editAppointment: 'I-edit ang Appointment',
      deleteAppointment: 'Tanggalin ang Appointment',
      confirmDelete: 'Sigurado ka bang gusto mong tanggalin ang appointment na ito?',
      cancel: 'Kanselahin',
      confirm: 'Kumpirmahin',
      delete: 'Tanggalin',
      edit: 'I-edit',
      saveChanges: 'I-save ang mga Pagbabago'
    }
  };

  const text = content[language];

  const announcements = [
    {
      title: language === 'en' ? 'Free Health Check-up' : 'Libreng Health Check-up',
      description: language === 'en' ? 'Every Monday & Wednesday, 8:00 AM - 12:00 PM' : 'Tuwing Lunes at Miyerkules, 8:00 AM - 12:00 PM',
      icon: 'health'
    },
    {
      title: language === 'en' ? 'Vaccination Drive' : 'Vaccination Drive',
      description: language === 'en' ? 'COVID-19 booster shots available' : 'Available ang COVID-19 booster shots',
      icon: 'vaccine'
    },
    {
      title: language === 'en' ? 'New Medical Equipment' : 'Bagong Medical Equipment',
      description: language === 'en' ? 'Ultrasound machine now available' : 'Available na ang Ultrasound machine',
      icon: 'equipment'
    },
    {
      title: language === 'en' ? 'Health Seminar' : 'Health Seminar',
      description: language === 'en' ? 'Diabetes awareness - Every Friday' : 'Diabetes awareness - Tuwing Biyernes',
      icon: 'seminar'
    }
  ];

  //ito simple logic for the carousel, change this too
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleAppointmentSubmit = (appointmentData) => {
    if (editingAppointment) {
      // Update existing appointment
      setAppointments(prev => prev.map(app => 
        app.id === editingAppointment.id 
          ? { ...app, ...appointmentData, status: 'confirmed' }
          : app
      ));
      setEditingAppointment(null);
    } else {
      // Create new appointment
      const newAppointment = {
        id: Date.now(),
        ...appointmentData,
        status: 'confirmed'
      };
      setAppointments(prev => [...prev, newAppointment]);
    }
    setShowScheduler(false);
    console.log('Appointment submitted:', appointmentData);
  };

  //itong mga handlers, setters and such, para to sa
  //mga screen na ise-set kung anong makikita niyo sa page
  const handleViewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowScheduler(true);
    setShowAppointmentDetails(false);
  };

  const handleDeleteAppointment = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAppointment = () => {
    setAppointments(prev => prev.filter(app => app.id !== appointmentToDelete));
    setShowAppointmentDetails(false);
    setSelectedAppointment(null);
    setShowDeleteConfirm(false);
    setAppointmentToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ito ang header, dito nakalagay si settings and account info tapos si upper left na introduction*/}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light text-gray-800">
              {text.welcome}, {userData.firstName}!
            </h1>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAccountInfo(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden md:inline">{text.accountInfo}</span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden md:inline">{text.settings}</span>
            </button>
          </div>
        </div>
      </div>

      {/* here nakalagay yung display account info na nilagay sa signup */}
      {showAccountInfo && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowAccountInfo(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-800">{text.accountTitle}</h2>
                <button onClick={() => setShowAccountInfo(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">{text.firstName}</p>
                  <p className="text-lg text-gray-800">{userData.firstName}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">{text.lastName}</p>
                  <p className="text-lg text-gray-800">{userData.lastName || 'N/A'}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">{text.age}</p>
                  <p className="text-lg text-gray-800">{userData.age || 'N/A'}</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">{text.address}</p>
                  <p className="text-lg text-gray-800">{userData.barangay || 'N/A'}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowAccountInfo(false)}
                className="w-full mt-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {text.closeBtn}
              </button>
            </div>
          </div>
        </>
      )}

      {/* eto yung nasa loob ng settigns */}
      {showSettings && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSettings(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-800">{text.settingsTitle}</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span className="text-gray-700">{text.themeLabel}</span>
                    </div>

                    {/* DI KO PA NALALAGYAN NG LOGIC TO KAYA NDI GAGANA*/}
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${darkMode ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {darkMode ? text.darkMode : text.lightMode}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setShowContact(true);
                  }}
                  className="w-full border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700">{text.contact}</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full border-2 border-red-500 text-red-600 rounded-lg p-4 hover:bg-red-50 transition-colors flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">{text.logout}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ito yungh ieedit niyo sa "contact us" */}
      {showContact && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowContact(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-800">{text.contactTitle}</h2>
                <button onClick={() => setShowContact(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-4">{text.healthCenter}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">{text.addressLabel}</p>
                        <p className="text-sm text-gray-800">123 Barangay Street, Quezon City, Metro Manila</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">{text.phoneLabel}</p>
                        <p className="text-sm text-gray-800">(02) 8123-4567 / 0917-123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">{text.emailLabel}</p>
                        <p className="text-sm text-gray-800">barangay.health@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowContact(false)}
                className="w-full mt-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {text.closeBtn}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ito 'yung lalabas kung anong info ng appointment */}
      {showAppointmentDetails && selectedAppointment && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowAppointmentDetails(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-light text-gray-800">{text.appointmentDetails}</h2>
                <button onClick={() => setShowAppointmentDetails(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-2">{text.appointmentDate}</h3>
                    <p className="text-gray-800">{selectedAppointment.selectedDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-2">{text.appointmentTime}</h3>
                    <p className="text-gray-800">{selectedAppointment.selectedTime}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">{text.status}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {language === 'en' ? 'Confirmed' : 'Nakumpirma'}
                  </span>
                </div>

                {/* Symptoms */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">{text.symptoms}</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedAppointment.symptoms).map(([category, symptoms]) => {
                      if (symptoms.length === 0) return null;
                      return (
                        <div key={category} className="border-l-4 border-green-500 pl-3">
                          <h4 className="font-medium text-gray-800 text-sm mb-1">
                            {language === 'en' ? 
                              category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1') :
                              text[category]
                            }
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {symptoms.map((symptom, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Meals */}
                {selectedAppointment.recentMeals && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-2">{text.recentMeals}</h3>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{selectedAppointment.recentMeals}</p>
                  </div>
                )}

                {/* Medications */}
                {selectedAppointment.medications && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-2">{text.medications}</h3>
                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{selectedAppointment.medications}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center p-6 border-t border-gray-200">
                <button
                  onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                  className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{text.deleteAppointment}</span>
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAppointmentDetails(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {text.cancel}
                  </button>
                  <button
                    onClick={() => handleEditAppointment(selectedAppointment)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>{text.editAppointment}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-800">{text.deleteAppointment}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{text.confirmDelete}</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {text.cancel}
                </button>
                <button
                  onClick={confirmDeleteAppointment}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {text.delete}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* LEFT SIDE - News and Announcements Carousel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={prevSlide}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-xl font-medium text-gray-800">{text.newsTitle}</h2>
              
              <button 
                onClick={nextSlide}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {announcements[currentSlide].title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {announcements[currentSlide].description}
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Appointments */}
          <div className="space-y-6">
            
            {/* Schedule New Appointment Button */}
            <button 
              onClick={() => setShowScheduler(true)}
              className="w-full bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-gray-800">{text.scheduleBtn}</h3>
                <svg className="w-8 h-8 text-green-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>

            {/* Appointment Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-4">{text.appointmentSummary}</h3>

              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4">{text.noAppointment}</p>
                  <button 
                    onClick={() => setShowScheduler(true)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    {text.scheduleNow}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {language === 'en' ? 'Health Check-up' : 'Health Check-up'}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {language === 'en' ? 'Date & Time' : 'Petsa at Oras'}
                          </p>
                          <p className="text-sm text-gray-800">
                            {appointment.selectedDate} - {appointment.selectedTime}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {language === 'en' ? 'Confirmed' : 'Nakumpirma'}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleViewAppointmentDetails(appointment)}
                        className="w-full py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors text-sm"
                      >
                        {text.viewDetails}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Scheduler Modal */}
      {showScheduler && (
        <AppointmentScheduler
          language={language}
          onClose={() => {
            setShowScheduler(false);
            setEditingAppointment(null);
          }}
          onSubmit={handleAppointmentSubmit}
          editingAppointment={editingAppointment}
        />
      )}
    </div>
  );
};

export default Dashboard;