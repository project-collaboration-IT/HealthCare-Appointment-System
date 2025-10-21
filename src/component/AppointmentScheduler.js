import { useState } from 'react';

const AppointmentScheduler = ({ language, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    symptoms: {
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
    recentMeals: '',
    medications: '',
    selectedDate: null,
    selectedTime: null
  });

  const content = {
    en: {
      title: 'Schedule an Appointment',
      step: 'Step',
      of: 'of',
      next: 'Next',
      back: 'Back',
      submit: 'Submit Appointment',
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
      step: 'Hakbang',
      of: 'ng',
      next: 'Susunod',
      back: 'Bumalik',
      submit: 'Isumite ang Appointment',
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
      mealsTitle: 'Mga Kinain Kamakailan',
      mealsDesc: 'Ano ang iyong kinain sa nakaraang ilang araw?',
      mealsPlaceholder: 'Pakibigay ang detalye ng iyong mga kinain sa nakaraang 2-3 araw...',
      medicationsTitle: 'Mga Gamot at Bitamina',
      medicationsDesc: 'Ilista ang lahat ng gamot at bitamina na iyong iniinom',
      medicationsPlaceholder: 'Pakibigay ang lahat ng gamot, bitamina, at supplements...',
      dateTitle: 'Pumili ng Petsa',
      dateDesc: 'Pumili ng available na petsa para sa iyong appointment',
      slotsAvailable: 'slots available',
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

  const generateCalendar = () => {
    const dates = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date,
          slots: Math.floor(Math.random() * 50) + 50
        });
      }
    }
    
    return dates;
  };

  const availableDates = generateCalendar();

  const timeSlots = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'
  ];

  const handleSubmit = () => {
    const appointmentData = {
      ...formData,
      submittedAt: new Date().toISOString()
    };
    onSubmit(appointmentData);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.symptomsTitle}</h3>
        <p className="text-sm text-gray-600 mb-6">{text.symptomsDesc}</p>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
        {Object.entries(symptomCategories).map(([category, symptoms]) => (
          <div key={category} className="border-b border-gray-200 pb-4">
            <h4 className="font-medium text-gray-700 mb-3">{text[category]}</h4>
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
        ))}
      </div>
    </div>
  );

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

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{text.dateTitle}</h3>
        <p className="text-sm text-gray-600 mb-6">{text.dateDesc}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {availableDates.map((dateObj, index) => {
          const isSelected = formData.selectedDate === dateObj.date.toDateString();
          return (
            <button
              key={index}
              onClick={() => setFormData({ ...formData, selectedDate: dateObj.date.toDateString() })}
              className={`p-4 border-2 rounded-lg transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="font-medium text-gray-800">
                {dateObj.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-500">
                {dateObj.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {dateObj.slots} {text.slotsAvailable}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

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
            <h2 className="text-2xl font-light text-gray-800">{text.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {text.step} {currentStep} {text.of} 5
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {text.back}
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {text.next}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.selectedDate || !formData.selectedTime}
              className={`px-6 py-2 rounded-lg transition-colors ${
                !formData.selectedDate || !formData.selectedTime
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {text.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;