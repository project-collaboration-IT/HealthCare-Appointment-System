//This is the component for the scheduling, kinda messy but i'll try to walk yall
// NOW CONNECTED TO DATABASE - saves appointments to Firebase!

import { useState, useEffect } from 'react';
import { findOptimalAppointmentSlot, formatRecommendationReason } from '../utils/appointmentAlgorithm';
import { ensureDayTimes, getAllTimesRemaining, formatDateId } from '../utils/availability';

//this is to initialize the states of the program - language, what page u are on, etc
//same ito sa other files na may same block of code
// UPDATED: Added isLoading prop to show when saving to database
const AppointmentScheduler = ({ language, onClose, onSubmit, editingAppointment, isLoading, refreshKey }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [recommendedSlot, setRecommendedSlot] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  //itong setCurrentStep or anything na kasunod ng "setCurrent" is used to replace whatever value was
  //then itong "useState" is the memory of React so diyan naka store ang data.
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Start at current month
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
    othersSymptoms: editingAppointment?.othersSymptoms || '',
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

  // Short description of the body/system for each category
  const symptomCategoryDescriptions = {
    general: language === 'en' ? 'Whole body / overall health' : 'Buong katawan / pangkalahatan',
    skin: language === 'en' ? 'Skin and rashes' : 'Balat at pantal',
    breast: language === 'en' ? 'Breast and chest area' : 'Dibdib at bahagi ng suso',
    earsNoseThroat: language === 'en' ? 'Ears, nose, and throat' : 'Tainga, ilong, at lalamunan',
    eyes: language === 'en' ? 'Eyes and vision' : 'Mata at paningin',
    cardiovascular: language === 'en' ? 'Heart and blood vessels' : 'Puso at mga ugat',
    respiratory: language === 'en' ? 'Lungs and breathing' : 'Baga at paghinga',
    gastrointestinal: language === 'en' ? 'Stomach and digestion' : 'Tiyan at pagtunaw ng pagkain',
    genitourinary: language === 'en' ? 'Urinary and reproductive' : 'Ihi at reproduktibo',
    musculoskeletal: language === 'en' ? 'Muscles and bones' : 'Kalamnan at buto',
    endocrine: language === 'en' ? 'Hormones and metabolism' : 'Hormones at metabolismo',
    hematologic: language === 'en' ? 'Blood and lymph' : 'Dugo at lymph',
    neurological: language === 'en' ? 'Brain and nerves' : 'Utak at nerbiyos',
    allergic: language === 'en' ? 'Allergy and immune system' : 'Allergy at immune system',
    psychiatric: language === 'en' ? 'Mood and sleep' : 'Pag-iisip at tulog',
    women: language === 'en' ? 'Women’s health' : 'Para sa kababaihan'
  };

  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState(() => {
    const initial = {};
    Object.keys(symptomCategories).forEach(k => { initial[k] = false; });
    return initial;
  });

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
          const isAvailable = isCurrentMonth && !isWeekend && !isPast;
          
          weekData.push({
            date: currentDate,
            day: currentDate.getDate(),
            isCurrentMonth,
            isWeekend,
            isPast,
            isAvailable,
            // slots will be loaded from Firestore separately
          });
        }
        
        monthData.weeks.push(weekData);
      }
      
      months.push(monthData);
    }
    
    return months;
  };

  const calendarData = generateCalendar();

  // Cache of remaining slots per day (keyed by YYYY-MM-DD)
  const [remainingByDate, setRemainingByDate] = useState({});
  const [loadingRemaining, setLoadingRemaining] = useState(false);
  // Cache of per-time remaining per date: { dateId: { '08-30-AM': 5, ... } }
  const [timesByDate, setTimesByDate] = useState({});
  const normalizeTimeKey = (timeLabel) => {
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(timeLabel);
    if (!match) return timeLabel.replace(/\s+/g, '-');
    const hour = String(parseInt(match[1], 10)).padStart(2, '0');
    const minute = match[2];
    const period = match[3].toUpperCase();
    return `${hour}-${minute}-${period}`;
  };

  // Prefetch remaining slots for the visible month
  useEffect(() => {
    const prefetchMonth = async () => {
      try {
        setLoadingRemaining(true);
        const currentMonthData = calendarData[currentMonth];
        const fetchDates = [];
        currentMonthData.weeks.forEach(week => {
          week.forEach(day => {
            if (day.isCurrentMonth && day.isAvailable) {
              fetchDates.push(day.date);
            }
          });
        });
        const results = await Promise.all(fetchDates.map(async (d) => {
          const times = await ensureDayTimes(d, timeSlots);
          const total = Object.values(times || {}).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
          return [formatDateId(d), { total, times }];
        }));
        setRemainingByDate(prev => {
          const next = { ...prev };
          results.forEach(([id, payload]) => { next[id] = payload.total; });
          return next;
        });
        setTimesByDate(prev => {
          const next = { ...prev };
          results.forEach(([id, payload]) => { next[id] = payload.times; });
          return next;
        });
      } catch (e) {
        // fail silently; UI will just show unknown
      } finally {
        setLoadingRemaining(false);
      }
    };
    prefetchMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, refreshKey]);

  // ito naman ginawa kong between 7-11 am lang available time kasi sa centers ganon talaga
  const timeSlots = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'
  ];

  // Extract available dates from calendar data for the algorithm
  const availableDates = [];
  calendarData.forEach(month => {
    month.weeks.forEach(week => {
      week.forEach(day => {
        if (day.isAvailable) {
          const id = formatDateId(day.date);
          const slots = remainingByDate[id] ?? 0;
          if (slots > 0) {
            availableDates.push({
              date: day.date,
              isAvailable: day.isAvailable,
              slots
            });
          }
        }
      });
    });
  });

  // No strict validation required in step 1 anymore
  const validateSymptoms = () => ({ isValid: true, unselectedCategories: [] });

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
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">{text.symptomsTitle}</h3>
          <p className="text-sm text-gray-600 mb-4">{text.symptomsDesc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 max-h-[calc(90vh-250px)]">
          {/* Left: Collapsible sections */}
          <div className="overflow-y-auto pr-2 space-y-3">
            {Object.entries(symptomCategories).map(([category, symptoms]) => {
              const expanded = expandedSections[category];
              return (
                <div key={category} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedSections(prev => ({ ...prev, [category]: !prev[category] }))}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-800">{text[category]}</div>
                      <div className="text-xs text-gray-500">{symptomCategoryDescriptions[category]}</div>
                    </div>
                    <svg className={`w-4 h-4 text-gray-500 transform transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expanded && (
                    <div className="px-4 pb-3 space-y-2">
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
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Others input */}
          <div className="h-fit lg:sticky lg:top-0">
            <div className="bg-white border border-yellow-300 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-800 mb-2">{language === 'en' ? 'Others (type any symptoms not listed)' : 'Iba pa (ilagay ang sintomas na wala sa listahan)'}</label>
              <textarea
                value={formData.othersSymptoms}
                onChange={(e) => setFormData({ ...formData, othersSymptoms: e.target.value })}
                rows="6"
                placeholder={language === 'en' ? 'Type here...' : 'I-type dito...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">{language === 'en' ? 'Optional' : 'Opsyonal'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="space-y-4 h-[calc(90vh-250px)] flex flex-col">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.mealsTitle}</h3>
        <p className="text-sm text-gray-600">{text.mealsDesc}</p>
      </div>

      <textarea
        value={formData.recentMeals}
        onChange={(e) => setFormData({ ...formData, recentMeals: e.target.value })}
        placeholder={text.mealsPlaceholder}
        rows="12"
        className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4 h-[calc(90vh-250px)] flex flex-col">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.medicationsTitle}</h3>
        <p className="text-sm text-gray-600">{text.medicationsDesc}</p>
      </div>

      <textarea
        value={formData.medications}
        onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
        placeholder={text.medicationsPlaceholder}
        rows="12"
        className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
      />
    </div>
  );
  
  const renderStep4 = () => {
    const currentMonthData = calendarData[currentMonth];
    const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    return (
      <div className="space-y-4 max-h-[calc(90vh-250px)]">
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">{text.dateTitle}</h3>
          <p className="text-sm text-gray-600 mb-4">{text.dateDesc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Left: Calendar */}
          <div className="flex flex-col overflow-hidden">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-3">
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
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {currentMonthData.weeks.map((week, weekIndex) =>
                  week.map((day, dayIndex) => {
                    const isSelected = formData.selectedDate === day.date.toDateString();
                    const id = formatDateId(day.date);
                    const remaining = remainingByDate[id];
                    const isDisabled = !day.isAvailable || (typeof remaining === 'number' ? remaining === 0 : false);
                    
                    return (
                      <button
                        key={`${weekIndex}-${dayIndex}`}
                        onClick={() => !isDisabled && setFormData({ ...formData, selectedDate: day.date.toDateString() })}
                        disabled={isDisabled}
                        className={`p-2 border-r border-b border-gray-200 last:border-r-0 min-h-[44px] flex flex-col items-center justify-center transition-all ${
                          !day.isCurrentMonth
                            ? 'bg-gray-50 text-gray-300'
                            : isDisabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'hover:bg-gray-50 text-gray-800'
                        }`}
                      >
                        <div className={`text-xs font-medium ${
                          !day.isCurrentMonth ? 'text-gray-300' : 
                          isDisabled ? 'text-gray-400' : 
                          isSelected ? 'text-green-800' : 'text-gray-800'
                        }`}>
                          {day.day}
                        </div>
                        
                        {day.isCurrentMonth && day.isAvailable && (
                          <div className={`text-[10px] mt-1 ${
                            (typeof remaining === 'number' && remaining === 0)
                              ? 'text-red-500 font-medium'
                              : (typeof remaining === 'number' && remaining < 10)
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}>
                            {typeof remaining === 'number' ? (remaining === 0 ? text.fullyBooked : `${remaining}`) : (loadingRemaining ? '...' : '')}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: Recommendation panel */}
          <div className="lg:sticky lg:top-0 self-start">
            <button
              onClick={() => {
                const optimal = findOptimalAppointmentSlot(availableDates, timeSlots);
                setRecommendedSlot(optimal);
                setShowRecommendation(true);
                if (optimal) {
                  setFormData({
                    ...formData,
                    selectedDate: optimal.date,
                    selectedTime: optimal.time
                  });
                }
              }}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>{language === 'en' ? 'Find Best Slot (AI)' : 'Maghanap ng Best Slot (AI)'}</span>
            </button>

            {showRecommendation && recommendedSlot && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {language === 'en' ? 'Recommended Slot' : 'Inirerekomendang Slot'}
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  <strong>{recommendedSlot.date} at {recommendedSlot.time}</strong>
                </p>
                <pre className="text-xs text-blue-700 whitespace-pre-wrap">
                  {formatRecommendationReason(recommendedSlot, language)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.timeTitle}</h3>
        <p className="text-sm text-gray-600">{text.timeDesc}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((time) => {
          const isSelected = formData.selectedTime === time;
          const dayId = formData.selectedDate ? formatDateId(new Date(formData.selectedDate)) : null;
          const perTimes = dayId ? (timesByDate[dayId] || {}) : {};
          const key = dayId ? normalizeTimeKey(time) : null;
          const remaining = key ? (typeof perTimes[key] === 'number' ? perTimes[key] : 5) : null;
          const isDisabled = !formData.selectedDate || (remaining !== null && remaining === 0);
          return (
            <button
              key={time}
              onClick={() => !isDisabled && setFormData({ ...formData, selectedTime: time })}
              disabled={isDisabled}
              className={`p-4 border-2 rounded-lg transition-all ${
                isDisabled
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="font-medium text-gray-800">{time}</div>
              {remaining !== null && (
                <div className={`text-xs mt-1 ${remaining === 0 ? 'text-red-500' : remaining <= 2 ? 'text-orange-600' : 'text-green-600'}`}>
                  {remaining === 0 ? text.fullyBooked : `${remaining} / 5`}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-xl w-full h-full md:h-[90vh] overflow-hidden flex flex-col">
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
                setCurrentStep(prev => prev + 1);
              }}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isLoading
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