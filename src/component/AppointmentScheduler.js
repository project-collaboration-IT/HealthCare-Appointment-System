//This is the component for the scheduling, kinda messy but i'll try to walk yall
// NOW CONNECTED TO DATABASE - saves appointments to Firebase!

import { useState } from 'react';

//this is to initialize the states of the program - language, what page u are on, etc
//same ito sa other files na may same block of code
// UPDATED: Added isLoading prop to show when saving to database
const AppointmentScheduler = ({ language, onClose, onSubmit, editingAppointment, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  //itong setCurrentStep or anything na kasunod ng "setCurrent" is used to replace whatever value was
  //then itong "useState" is the memory of React so diyan naka store ang data.
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January, 1 = February, etc.
  const [formData, setFormData] = useState({
    //under this is yung mga checkboxes ng symptoms
    symptoms: editingAppointment?.symptoms || {
      general: [],
      skin: [],
      breast: [],
      earsNoseThroat: [],
      eyes: [],
      cardiovascular: [],
      respiratory: [],
      gastrointestinal: [],
      genitourinary: [],
      musculoskeletal: [],
      endocrine: [],
      hematologic: [],
      neurological: [],
      allergic: [],
      psychiatric: [],
      women: []
    },
    recentMeals: editingAppointment?.recentMeals || '',
    medications: editingAppointment?.medications || '',
    selectedDate: editingAppointment?.selectedDate || null,
    selectedTime: editingAppointment?.selectedTime || null
  });

    //ito is same with other files, basta merong en or tl, matic for language selection
  const content = {
    en: {
      title: 'Schedule an Appointment',
      editTitle: 'Edit Appointment',
      step: 'Step',
      of: 'of',
      next: 'Next',
      back: 'Back',
      submit: 'Submit Appointment',
      submitting: 'Saving...',  // NEW: Loading text
      // Step 1
      symptomsTitle: 'What are you feeling?',
      symptomsDesc: 'Please check all symptoms that apply to you',
      general: 'General',
      skin: 'Skin',
      breast: 'Breast',
      earsNoseThroat: 'Ears/Nose/Throat',
      eyes: 'Eyes',
      cardiovascular: 'Cardiovascular',
      respiratory: 'Respiratory',
      gastrointestinal: 'Gastrointestinal',
      genitourinary: 'Genitourinary',
      musculoskeletal: 'Musculoskeletal',
      endocrine: 'Endocrine',
      hematologic: 'Hematologic/Lymphatic',
      neurological: 'Neurological',
      allergic: 'Allergic/Immune',
      psychiatric: 'Psychiatric',
      women: 'Women Only',
      validationError: 'Please select at least one option in each category:',
      // Step 2
      mealsTitle: 'Recent Meals',
      mealsDesc: 'What have you eaten in the past few days?',
      mealsPlaceholder: 'Please describe your meals for the past 2-3 days...',
      // Step 3
      medicationsTitle: 'Medications & Vitamins',
      medicationsDesc: 'List all medications and vitamins you are currently taking',
      medicationsPlaceholder: 'Please list all medications, vitamins, and supplements...',
      // Step 4
      dateTitle: 'Select Date',
      dateDesc: 'Choose an available date for your appointment',
      slotsAvailable: 'slots available',
      fullyBooked: 'Fully Booked',
      // Step 5
      timeTitle: 'Select Time',
      timeDesc: 'Choose your preferred time slot',
      morning: 'Morning',
      confirmationTitle: 'Appointment Scheduled!',
      confirmationMsg: 'Your appointment has been successfully scheduled.',
      viewAppointment: 'View Appointment'
    },
    tl: {
      title: 'Mag-iskedyul ng Appointment',
      editTitle: 'I-edit ang Appointment',
      step: 'Hakbang',
      of: 'ng',
      next: 'Susunod',
      back: 'Bumalik',
      submit: 'Isumite ang Appointment',
      submitting: 'Nag-se-save...',  // NEW: Loading text
      symptomsTitle: 'Ano ang iyong nararamdaman?',
      symptomsDesc: 'Pakitandaan lahat ng sintomas na nararanasan mo',
      general: 'Pangkalahatan',
      skin: 'Balat',
      breast: 'Suso',
      earsNoseThroat: 'Tainga/Ilong/Lalamunan',
      eyes: 'Mata',
      cardiovascular: 'Puso at Ugat',
      respiratory: 'Paghinga',
      gastrointestinal: 'Tiyan at Bituka',
      genitourinary: 'Ari at Ihi',
      musculoskeletal: 'Kalamnan at Buto',
      endocrine: 'Hormones',
      hematologic: 'Dugo at Lymph',
      neurological: 'Nerbiyos',
      allergic: 'Allergy at Immune',
      psychiatric: 'Mental Health',
      women: 'Para sa Kababaihan Lamang',
      validationError: 'Pakipili ng kahit isang opsyon sa bawat kategorya:',
      mealsTitle: 'Mga Kinain Kamakailan',
      mealsDesc: 'Ano ang iyong kinain sa nakaraang ilang araw?',
      mealsPlaceholder: 'Pakibigay ang detalye ng iyong mga kinain sa nakaraang 2-3 araw...',
      medicationsTitle: 'Mga Gamot at Bitamina',
      medicationsDesc: 'Ilista ang lahat ng gamot at bitamina na iyong iniinom',
      medicationsPlaceholder: 'Pakibigay ang lahat ng gamot, bitamina, at supplements...',
      dateTitle: 'Pumili ng Petsa',
      dateDesc: 'Pumili ng available na petsa para sa iyong appointment',
      slotsAvailable: 'slots available',
      fullyBooked: 'Punong-puno na',
      timeTitle: 'Pumili ng Oras',
      timeDesc: 'Pumili ng oras na gusto mo',
      morning: 'Umaga',
      confirmationTitle: 'Na-iskedyul ang Appointment!',
      confirmationMsg: 'Matagumpay na na-iskedyul ang iyong appointment.',
      viewAppointment: 'Tingnan ang Appointment'
    }
  };

  const text = content[language];

  const symptomCategories = {
    general: [
      'Unexplained weight loss / gain',
      'Unexplained fatigue / weakness',
      'Fall asleep during day when sitting',
      'Fever, chills',
      'No problems'
    ],
    skin: [
      'New or change in mole',
      'Rash / itching',
      'No problems'
    ],
    breast: [
      'Breast lump / pain / nipple discharge',
      'No problems'
    ],
    earsNoseThroat: [
      'Nosebleeds, trouble swallowing',
      'Frequent sore throat, hoarseness',
      'Hearing loss / ringing in ears',
      'No problems'
    ],
    eyes: [
      'Change in vision / eye pain / redness',
      'No problems'
    ],
    cardiovascular: [
      'Chest pain / discomfort',
      'Palpitations (fast or irregular heartbeat)',
      'No problems'
    ],
    respiratory: [
      'Cough / wheeze',
      'Loud snoring / altered breathing during sleep',
      'Short of breath with exertion',
      'No problems'
    ],
    gastrointestinal: [
      'Heartburn / reflux / indigestion',
      'Blood or change in bowel movement',
      'Constipation',
      'No problems'
    ],
    genitourinary: [
      'Leaking urine',
      'Blood in urine',
      'Nighttime urination or increased frequency',
      'Discharge: penis or vagina',
      'Concern with sexual function',
      'No problems'
    ],
    musculoskeletal: [
      'Neck pain',
      'Back pain',
      'Muscle / joint pain',
      'No problems'
    ],
    endocrine: [
      'Heat or cold sensitivity',
      'No problems'
    ],
    hematologic: [
      'Swollen glands',
      'Easy bruising',
      'No problems'
    ],
    neurological: [
      'Headache',
      'Memory loss',
      'Fainting',
      'Dizziness',
      'Numbness / tingling',
      'Unsteady gait',
      'Frequent falls',
      'No problems'
    ],
    allergic: [
      'Hay fever / allergies',
      'Frequent infections',
      'No problems'
    ],
    psychiatric: [
      'Anxiety / stress / irritability',
      'Sleep problem',
      'Lack of concentration',
      'No problems'
    ],
    women: [
      'Pre-menstrual symptoms (bloating, cramps, irritability)',
      'Problem with menstrual periods',
      'Hot flashes / night sweats',
      'No problems'
    ]
  };

  const toggleSymptom = (category, symptom) => {
    setFormData(prev => {
      const categorySymptoms = prev.symptoms[category];
      const isSelected = categorySymptoms.includes(symptom);
      
      return {
        ...prev,
        symptoms: {
          ...prev.symptoms,
          [category]: isSelected
            ? categorySymptoms.filter(s => s !== symptom)
            : [...categorySymptoms, symptom]
        }
      };
    });
  };

  //code nito nakuha ko lang somewhere in the internet....
  const generateCalendar = () => {
    const year = 2025;
    const months = [];
    
    // Generate calendar for each month
    for (let month = 0; month < 12; month++) {
      const monthData = {
        month: month,
        monthName: new Date(year, month).toLocaleDateString('en-US', { month: 'long' }),
        year: year,
        weeks: []
      };
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      
      // Adjust to start from Sunday
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      // Generate 6 weeks (42 days) to ensure we cover the entire month
      for (let week = 0; week < 6; week++) {
        const weekData = [];
        
        for (let day = 0; day < 7; day++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + (week * 7) + day);
          
          const isCurrentMonth = currentDate.getMonth() === month;
          const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
          const isPast = currentDate < new Date();
          
          let slots = 0;
          let isAvailable = false;
          
          if (isCurrentMonth && !isWeekend && !isPast) {
            isAvailable = true;

            // ito please palitan niyo hwhahaha naka-random siya kapag
            // pinindot niyo yung any date, in reality connected dapat sa db kung ilan nalang slots

            // Generate realistic slot availability
            const random = Math.random();
            
            if (random < 0.15) {
              // 15% chance of 0 slots (fully booked)
              slots = 0;
            } else if (random < 0.25) {
              // 10% chance of low slots (1-10)
              slots = Math.floor(Math.random() * 10) + 1;
            } else {
              // 75% chance of good availability (20-50)
              slots = Math.floor(Math.random() * 31) + 20;
            }
          }
          
          weekData.push({
            date: currentDate,
            day: currentDate.getDate(),
            isCurrentMonth,
            isWeekend,
            isPast,
            isAvailable,
            slots
          });
        }
        
        monthData.weeks.push(weekData);
      }
      
      months.push(monthData);
    }
    
    return months;
  };

  const calendarData = generateCalendar();

  // ito naman ginawa kong between 7-11 am lang available time kasi sa centers ganon talaga
  const timeSlots = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'
  ];

  //ito validations ng checked boxes
  const validateSymptoms = () => {
    const symptomCategories = Object.keys(formData.symptoms);
    const unselectedCategories = [];
    
    symptomCategories.forEach(category => {
      if (formData.symptoms[category].length === 0) {
        unselectedCategories.push(category);
      }
    });
    
    return {
      isValid: unselectedCategories.length === 0,
      unselectedCategories
    };
  };

  // UPDATED: Handle submit - now just calls onSubmit which saves to database
  // The actual saving happens in Dashboard.js
  const handleSubmit = () => {
    const appointmentData = {
      ...formData,
      submittedAt: new Date().toISOString()
    };
    // Call the onSubmit function passed from Dashboard
    // This will save to the database
    onSubmit(appointmentData);
  };

  //itong render kinda magulo si code pero for validation lang
  const renderStep1 = () => {
    const validation = validateSymptoms();
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">{text.symptomsTitle}</h3>
          <p className="text-sm text-gray-600 mb-6">{text.symptomsDesc}</p>
          
          {!validation.isValid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600 font-medium mb-1">
                {text.validationError}
              </p>
              <ul className="text-xs text-red-600 list-disc list-inside">
                {validation.unselectedCategories.map(category => (
                  <li key={category}>{text[category]}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
          {Object.entries(symptomCategories).map(([category, symptoms]) => {
            const isUnselected = validation.unselectedCategories.includes(category);
            
            return (
              <div key={category} className={`border-b border-gray-200 pb-4 ${isUnselected ? 'bg-red-50 rounded-lg p-3' : ''}`}>
                <h4 className={`font-medium mb-3 ${isUnselected ? 'text-red-700' : 'text-gray-700'}`}>
                  {text[category]}
                  {isUnselected && <span className="text-red-500 ml-2">*</span>}
                </h4>
                <div className="space-y-2">
                  {symptoms.map((symptom) => (
                    <label key={symptom} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.symptoms[category].includes(symptom)}
                        onChange={() => toggleSymptom(category, symptom)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.mealsTitle}</h3>
        <p className="text-sm text-gray-600 mb-6">{text.mealsDesc}</p>
      </div>

      <textarea
        value={formData.recentMeals}
        onChange={(e) => setFormData({ ...formData, recentMeals: e.target.value })}
        placeholder={text.mealsPlaceholder}
        rows="10"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.medicationsTitle}</h3>
        <p className="text-sm text-gray-600 mb-6">{text.medicationsDesc}</p>
      </div>

      <textarea
        value={formData.medications}
        onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
        placeholder={text.medicationsPlaceholder}
        rows="10"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
      />
    </div>
  );

  const renderStep4 = () => {
    const currentMonthData = calendarData[currentMonth];
    const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">{text.dateTitle}</h3>
          <p className="text-sm text-gray-600 mb-6">{text.dateDesc}</p>
        </div>


        {/* ito nagsstart siya sa january instead of today's month, kindly change it*/}
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))}
            disabled={currentMonth === 0}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h4 className="text-lg font-semibold text-gray-800">
            {currentMonthData.monthName.toUpperCase()} {currentMonthData.year}
          </h4>
          
          <button
            onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))}
            disabled={currentMonth === 11}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-100">
            {dayHeaders.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {currentMonthData.weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => {
                const isSelected = formData.selectedDate === day.date.toDateString();
                const isDisabled = !day.isAvailable || day.slots === 0;
                
                return (
                  <button
                    key={`${weekIndex}-${dayIndex}`}
                    onClick={() => !isDisabled && setFormData({ ...formData, selectedDate: day.date.toDateString() })}
                    disabled={isDisabled}
                    className={`p-3 border-r border-b border-gray-200 last:border-r-0 min-h-[60px] flex flex-col items-center justify-center transition-all ${
                      !day.isCurrentMonth
                        ? 'bg-gray-50 text-gray-300'
                        : isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'hover:bg-gray-50 text-gray-800'
                    }`}
                  >
                    <div className={`text-sm font-medium ${
                      !day.isCurrentMonth ? 'text-gray-300' : 
                      isDisabled ? 'text-gray-400' : 
                      isSelected ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {day.day}
                    </div>
                    
                    {day.isCurrentMonth && day.isAvailable && (
                      <div className={`text-xs mt-1 ${
                        day.slots === 0
                          ? 'text-red-500 font-medium'
                          : day.slots < 10
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}>
                        {day.slots === 0 ? text.fullyBooked : `${day.slots}`}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.timeTitle}</h3>
        <p className="text-sm text-gray-600 mb-6">{text.timeDesc}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {timeSlots.map((time) => {
          const isSelected = formData.selectedTime === time;
          return (
            <button
              key={time}
              onClick={() => setFormData({ ...formData, selectedTime: time })}
              className={`p-4 border-2 rounded-lg transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="font-medium text-gray-800">{time}</div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-light text-gray-800">
              {editingAppointment ? text.editTitle : text.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {text.step} {currentStep} {text.of} 5
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}  // Disable close button while saving
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/*yep, progress bar siya, angas no*/}
        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Footer - UPDATED with loading state */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1 || isLoading}  // Disable while saving
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === 1 || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {text.back}
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => {
                if (currentStep === 1) {
                  const validation = validateSymptoms();
                  if (validation.isValid) {
                    setCurrentStep(prev => prev + 1);
                  }
                } else {
                  setCurrentStep(prev => prev + 1);
                }
              }}
              disabled={(currentStep === 1 && !validateSymptoms().isValid) || isLoading}
              className={`px-6 py-2 rounded-lg transition-colors ${
                (currentStep === 1 && !validateSymptoms().isValid) || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {text.next}
            </button> 
          ) : (
            // UPDATED: Submit button shows loading state
            <button
              onClick={handleSubmit}
              disabled={!formData.selectedDate || !formData.selectedTime || isLoading}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                !formData.selectedDate || !formData.selectedTime || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {/* Show spinner when loading */}
              {isLoading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isLoading ? text.submitting : text.submit}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;