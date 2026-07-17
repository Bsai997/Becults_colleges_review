import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import api from '../api/axios';

// Questions for each rating field
const FIELD_QUESTIONS = {
  faculty: [
    'Are the faculty members approachable when you have doubts?',
    'Do teachers explain concepts clearly or mostly read from slides?',
    'Are faculty supportive of projects, hackathons, research, or startups?',
    'Do faculty encourage skill development beyond the syllabus?',
    'How strict are the faculty regarding attendance and assignments?',
    'Which department has the strongest faculty, and why?',
    'What should a new student know about the teaching style here?'
  ],
  placements: [
    'What is the real placement situation in your branch?',
    'Which companies actually hired students from your batch?',
    'Did the college provide useful placement training?',
    'Are internship opportunities easily available?',
    'Do students get opportunities based on skills or mostly CGPA?',
    'What should juniors start preparing for from first year?',
    'What is one placement reality that advertisements donot mention?'

  ],
  techEvents: [
    'What technical workshops and seminars are organized?',
    'Are there hackathons and coding competitions?',
    'How supportive is the college for tech club activities?',
    'What opportunities exist for tech conferences and competitions?',
    'Are there online tech events and certifications encouraged?'
  ],
  infrastructure: [
    'What is the condition of classroom buildings and labs?',
    'Are there modern sports facilities and recreational areas?',
    'How is the library and WiFi connectivity?',
    'Are there separate facilities for boys and girls?',
    'How is the campus cleanliness and maintenance?'
  ],
  collegeLife: [
    'What are the opportunities for cultural and sports activities?',
    'How active are the clubs and societies on campus?',
    'What is the social life and friend-making potential?',
    'Are there regular fests and events throughout the year?',
    'How supportive is the college for student initiatives?'
  ],
  accommodation: [
    'What is the quality of college accommodation and hostel facilities?',
    'How is the food quality and variety in the mess/canteen?',
    'Are there adequate bathroom and hygiene facilities?',
    'What is the security and safety situation in hostels?',
    'How flexible are the hostel rules and curfew timings?',
    'Is accommodation available for all students or limited to certain years?',
    'What is the cost of accommodation compared to nearby private hostels?'
  ]
};

const REVIEW_SUGGESTIONS = {
  pros: [
    'Good Placements', 'Friendly Faculty', 'Student Freedom', 'Internship Support',
    'Good Infrastructure', 'Good Hostel', 'Good Hostel Food', 'Strong Coding Culture',
    'Tech Fests', 'Cultural Fests', 'Active Clubs', 'Startup Support', 'Modern Labs',
    'Good Library', 'Fast Wi-Fi', 'Cricket Ground', 'Basketball / Badminton Courts',
    'Ragging Free', 'Good Canteen', 'Value for Money'
  ],
  cons: [
    'Poor Placements', 'Strict Attendance', 'Strict Rules', 'Poor Hostel Food',
    'Poor Hostel', 'Poor Infrastructure', 'Unsupportive Faculty', 'Poor Teaching',
    'Outdated Labs', 'Poor Wi-Fi', 'Limited Internships', 'No Startup Support',
    'Inactive Clubs', 'Fewer Tech Events', 'Poor Canteen', 'No Student Freedom',
    'Long College Hours', 'Hidden Fees', 'Poor Management', 'Weak Coding Culture'
  ]
};

export default function AddReviewPage() {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedBlocks, setExpandedBlocks] = useState({
    honestReview: false,
    accommodation: false,
    juniorAdvice: false,
    studentInformation: false
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [suggestionField, setSuggestionField] = useState(null);
  const [customTag, setCustomTag] = useState({ pros: '', cons: '' });
  const [accommodationDetails, setAccommodationDetails] = useState({
    studentType: 'dayScholar',
    hostelFacilities: 'no',
    outsideHostel: 'no'
  });
  const [studentInfo, setStudentInfo] = useState({
    seatType: 'eapcet',
    eapcetRank: '',
    collegeId: '',
    branch: '',
    year: '',
    batch: '',
    instagramId: '',
    name: ''
  });

  // Toggle expandable blocks
  const toggleBlock = (blockName) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockName]: !prev[blockName]
    }));
  };

  // Toggle question sections
  const toggleQuestions = (field) => {
    setExpandedQuestions(prev => ({
      [field]: !prev[field]
    }));
  };

  // Form state
  const [formData, setFormData] = useState({
    faculty: '',
    placements: '',
    techEvents: '',
    infrastructure: '',
    collegeLife: '',
    accommodation: '',
    pros: [''],
    cons: [''],
    advice_to_juniors: '',
    overall_about_college: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const handleGlobalPointerDown = (event) => {
      const target = event.target;
      if (target.closest('[data-question-panel]') || target.closest('[data-question-trigger]')) {
        return;
      }
      setExpandedQuestions({});
    };

    window.addEventListener('mousedown', handleGlobalPointerDown);
    window.addEventListener('touchstart', handleGlobalPointerDown);

    return () => {
      window.removeEventListener('mousedown', handleGlobalPointerDown);
      window.removeEventListener('touchstart', handleGlobalPointerDown);
    };
  }, []);

  const fetchCollege = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/colleges/${collegeId}`);
      setCollege(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching college:', err);
      setError('Failed to load college details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
  }, [collegeId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for this field
    setValidationErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleStudentInfoChange = (field, value) => {
    setStudentInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const items = prev[field];
      const updatedItems = items.length === 1 ? [''] : items.filter((_, itemIndex) => itemIndex !== index);
      return { ...prev, [field]: updatedItems };
    });
  };

  const addReviewTag = (field, value) => {
    const tag = value.trim();
    if (!tag) return;

    setFormData(prev => {
      const currentTags = prev[field].filter(item => item.trim());
      if (currentTags.some(item => item.toLowerCase() === tag.toLowerCase())) return prev;
      return { ...prev, [field]: [...currentTags, tag] };
    });
    setCustomTag(prev => ({ ...prev, [field]: '' }));
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    // Block 1 validation
    if (!formData.faculty.trim()) errors.faculty = 'Faculty review is required';
    if (!formData.placements.trim()) errors.placements = 'Placements review is required';
    if (!formData.techEvents.trim()) errors.techEvents = 'Tech and Non Tech Events review is required';
    if (!formData.infrastructure.trim()) errors.infrastructure = 'Infrastructure & Sports review is required';
    if (!formData.collegeLife.trim()) errors.collegeLife = 'College life review is required';

    // Block 2 validation - Accommodation
    if (accommodationDetails.studentType === 'hosteller' && !formData.accommodation.trim()) {
      errors.accommodation = 'Accommodation review is required';
    }

    // Block 3 validation
    if (formData.pros.filter(p => p.trim()).length === 0) errors.pros = 'At least one positive is required';
    if (formData.cons.filter(c => c.trim()).length === 0) errors.cons = 'At least one negative is required';
    if (!formData.advice_to_juniors.trim()) errors.advice_to_juniors = 'Advice to juniors is required';
    if (!formData.overall_about_college.trim()) errors.overall_about_college = 'Overall about college is required';

    // Block 4 validation - Student information
    if (!studentInfo.collegeId.trim()) errors.collegeId = 'College ID is required';
    if (!studentInfo.branch.trim()) errors.branch = 'Branch is required';
    if (!studentInfo.year.trim()) errors.year = 'Year is required';
    if (!studentInfo.batch.trim()) errors.batch = 'Batch is required';
    if (!studentInfo.instagramId.trim()) errors.instagramId = 'Instagram ID is required';
    if (!studentInfo.name.trim()) errors.name = 'Name is required';

    if (studentInfo.seatType === 'eapcet') {
      if (!studentInfo.eapcetRank.trim()) {
        errors.eapcetRank = 'EAPCET rank is required for EAPCET seat';
      } else if (!/^\d+$/.test(studentInfo.eapcetRank.trim())) {
        errors.eapcetRank = 'EAPCET rank must contain digits only';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = {
        college_id: collegeId,
        name: studentInfo.name,
        college_id_number: studentInfo.collegeId,
        branch: studentInfo.branch,
        year: studentInfo.year,
        batch: studentInfo.batch,
        admission_type: studentInfo.seatType,
        eapcet_rank: studentInfo.seatType === 'eapcet' ? studentInfo.eapcetRank.trim() : '',
        instagram_id: studentInfo.instagramId,
        is_hosteller: accommodationDetails.studentType === 'hosteller',
        college_hostel_available: accommodationDetails.hostelFacilities === 'yes',
        outside_hostel: accommodationDetails.outsideHostel === 'yes',
        faculty: formData.faculty,
        placements: formData.placements,
        tech_events: formData.techEvents,
        infrastructure: formData.infrastructure,
        college_life: formData.collegeLife,
        accommodation: formData.accommodation,
        pros: formData.pros.filter(p => p.trim()),
        cons: formData.cons.filter(c => c.trim()),
        advice_to_juniors: formData.advice_to_juniors,
        overall_about_college: formData.overall_about_college
      };

      // TODO: Update this endpoint once backend is ready
      await api.post('/reviews', submitData);
      setSuccessMessage('Thanks for your honest feedback!');

      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err) {
      console.error('Error submitting review:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to submit review. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-becults-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error || 'College not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8fd_0%,#eaf3fb_100%)] py-8 px-4">
      {/* Success Modal Overlay */}
      {successMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
            <p className="text-lg text-gray-700 mb-4">{successMessage}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-9 font-calsans"> 
  <h1 className="text-4xl sm:text-6xl md:text-4xl font-extrabold text-[#1A699F]"> 
    Say.<span className="text-[#121111] font-sans font-extrabold ">What<br/>no one told you</span><br/>
    <span className="text-[#D3540D] font-sans font-extrabold ">before College Joining</span> 
  </h1> 
</div>


        

        {/* Form - Block 1: Give Your Honest Review */}
        <form
          onSubmit={handleSubmit}
          onFocusCapture={(event) => {
            if (!event.target.dataset.suggestionInput) setSuggestionField(null);
          }}
          className="space-y-4"
        >
          {/* BLOCK 1: Give Your Honest Review */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            {/* Block Header - Expandable */}
            <button
              type="button"
              onClick={() => toggleBlock('honestReview')}
              className="w-full flex items-center justify-between bg-white px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-[#061327] font-sans" >Give your Honest Review</h3>
              <ChevronDown
                size={24}
                className={`text-gray-600 transition-transform ${expandedBlocks.honestReview ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Block Content - Expandable Ratings */}
            {expandedBlocks.honestReview && (
              <div className="border-t border-gray-200 p-6 space-y-6 bg-white">
                
                {/* Faculty */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-800">Faculty <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => toggleQuestions('faculty')}
                      data-question-trigger="true"
                      className="w-10 h-4 px-1 py-0 rounded-[6px] bg-[#D9D9D9] text-[#1d1c1c] hover:opacity-80 transition-opacity flex items-center justify-center text-xs font-semibold gap-1"
                      title="View guiding questions"
                    >
                      <span>Q's</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${expandedQuestions.faculty ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {expandedQuestions.faculty && (
                    <div
                      className="absolute right-4 top-7 z-50 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 w-80"
                      data-question-panel="true"
                    >
                      <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                        {FIELD_QUESTIONS.faculty.map((question, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-2">
                              <span className="text-gray-600 font-bold flex-shrink-0">{idx + 1}.</span>
                              <p className="text-gray-900">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea
                    placeholder="Tell everything about your faculty experience."
                    value={formData.faculty}
                    onChange={(e) => setFormData(prev => ({...prev, faculty: e.target.value}))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                      validationErrors.faculty ? 'border-black focus:ring-black' : 'border-gray-300 focus:ring-[#8b8989]'
                    }`}
                    rows="3"
                  />
                  {validationErrors.faculty && <p className="text-red-500 text-sm mt-1">{validationErrors.faculty}</p>}
                </div>

                {/* Placements */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-[#061327]">Placements <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => toggleQuestions('placements')}
                      data-question-trigger="true"
                      className="w-10 h-4 px-1 py-0 rounded-[6px] bg-[#D9D9D9] text-[#212020] hover:opacity-80 transition-opacity flex items-center justify-center text-xs font-semibold gap-1"
                      title="View guiding questions"
                    >
                      <span>Q's</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${expandedQuestions.placements ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {expandedQuestions.placements && (
                    <div 
                      className="absolute right-4 top-7 z-50 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 w-80"
                      data-question-panel="true"
                    >
                      <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                        {FIELD_QUESTIONS.placements.map((question, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-2">
                              <span className="text-gray-600 font-bold flex-shrink-0">{idx + 1}.</span>
                              <p className="text-gray-900">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea
                    placeholder="Tell the real placement story here."
                    value={formData.placements}
                    onChange={(e) => setFormData(prev => ({...prev, placements: e.target.value}))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                      validationErrors.placements ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8b8989]'
                    }`}
                    rows="3"
                  />
                  {validationErrors.placements && <p className="text-red-500 text-sm mt-1">{validationErrors.placements}</p>}
                </div>

                {/* Tech and Non Tech Events */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-[#061327]">Tech and Non Tech Events <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => toggleQuestions('techEvents')}
                      data-question-trigger="true"
                      className="w-10 h-4 px-1 py-0 rounded-[6px] bg-[#D9D9D9] text-[#212020] hover:opacity-80 transition-opacity flex items-center justify-center text-xs font-semibold gap-1"
                      title="View guiding questions"
                    >
                      <span>Q's</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${expandedQuestions.techEvents ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {expandedQuestions.techEvents && (
                    <div 
                      className="absolute right-4 top-7 z-50 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 w-80"
                      data-question-panel="true"
                    >
                      <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                        {FIELD_QUESTIONS.techEvents.map((question, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-2">
                              <span className="text-gray-600 font-bold flex-shrink-0">{idx + 1}.</span>
                              <p className="text-gray-900">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea
                    placeholder="Share your event and club experience."
                    value={formData.techEvents}
                    onChange={(e) => setFormData(prev => ({...prev, techEvents: e.target.value}))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                      validationErrors.techEvents ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8b8989]'
                    }`}
                    rows="3"
                  />
                  {validationErrors.techEvents && <p className="text-red-500 text-sm mt-1">{validationErrors.techEvents}</p>}
                </div>

                {/* Infrastructure & Sports */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-[#061327]">Infrastructure & Sports <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => toggleQuestions('infrastructure')}
                      data-question-trigger="true"
                      className="w-10 h-4 px-1 py-0 rounded-[6px] bg-[#D9D9D9] text-[#212020] hover:opacity-80 transition-opacity flex items-center justify-center text-xs font-semibold gap-1"
                      title="View guiding questions"
                    >
                      <span>Q's</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${expandedQuestions.infrastructure ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {expandedQuestions.infrastructure && (
                    <div 
                      className="absolute right-4 top-7 z-50 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 w-80"
                      data-question-panel="true"
                    >
                      <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                        {FIELD_QUESTIONS.infrastructure.map((question, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-2">
                              <span className="text-gray-600 font-bold flex-shrink-0">{idx + 1}.</span>
                              <p className="text-gray-900">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea
                    placeholder="Tell everything about campus facilities."
                    value={formData.infrastructure}
                    onChange={(e) => setFormData(prev => ({...prev, infrastructure: e.target.value}))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                      validationErrors.infrastructure ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8b8989]'
                    }`}
                    rows="3"
                  />
                  {validationErrors.infrastructure && <p className="text-red-500 text-sm mt-1">{validationErrors.infrastructure}</p>}
                </div>

                {/* College life */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-800">College life <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => toggleQuestions('collegeLife')}
                      data-question-trigger="true"
                      className="w-10 h-4 px-1 py-0 rounded-[6px] bg-[#D9D9D9] text-[#212020] hover:opacity-80 transition-opacity flex items-center justify-center text-xs font-semibold gap-1"
                      title="View guiding questions"
                    >
                      <span>Q's</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${expandedQuestions.collegeLife ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {expandedQuestions.collegeLife && (
                    <div 
                      className="absolute right-4 top-7 z-50 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 w-80"
                      data-question-panel="true"
                    >
                      <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                        {FIELD_QUESTIONS.collegeLife.map((question, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-2">
                              <span className="text-gray-600 font-bold flex-shrink-0">{idx + 1}.</span>
                              <p className="text-gray-900">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea
                    placeholder="Describe your complete college life experience."
                    value={formData.collegeLife}
                    onChange={(e) => setFormData(prev => ({...prev, collegeLife: e.target.value}))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                      validationErrors.collegeLife ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#8b8989]'
                    }`}
                    rows="3"
                  />
                  {validationErrors.collegeLife && <p className="text-red-500 text-sm mt-1">{validationErrors.collegeLife}</p>}
                </div>
              </div>
            )}
          </div>

          {/* BLOCK 2: Accommodation */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={() => toggleBlock('accommodation')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors sm:px-6"
            >
              <h3 className="text-lg font-bold text-gray-900">Accommodation</h3>
              <ChevronDown
                size={22}
                className={`text-gray-600 transition-transform ${expandedBlocks.accommodation ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedBlocks.accommodation && <div className="border-t border-gray-200 p-5 sm:p-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-800 mb-2">Are you a Hosteller or Day Scholar? <span className="text-red-500">*</span></p>
                <div className="flex max-w-sm gap-2">
                  {[
                    ['dayScholar', 'Day Scholar'],
                    ['hosteller', 'Hosteller']
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAccommodationDetails(prev => ({ ...prev, studentType: value }))}
                      className={`h-10 w-36 rounded-xl border text-xs font-medium transition-colors ${
                        accommodationDetails.studentType === value
                          ? 'border-[#2475aa] bg-[#2475aa] text-white'
                          : 'border-[#d4a38d] bg-white text-[#ef6c20]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {accommodationDetails.studentType === 'hosteller' && <>
              <div>
                <p className="text-sm font-medium text-gray-800 mb-2">College hostel facilities available?</p>
                <div className="flex gap-2">
                  {['yes', 'no'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAccommodationDetails(prev => ({ ...prev, hostelFacilities: value }))}
                      className={`h-8 min-w-14 rounded-lg border px-4 text-xs font-medium capitalize transition-colors ${
                        accommodationDetails.hostelFacilities === value
                          ? 'border-[#2475aa] bg-[#2475aa] text-white'
                          : 'border-[#d4a38d] bg-white text-[#ef6c20]'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 mb-2">Staying in outside hostel?</p>
                <div className="flex gap-2">
                  {['yes', 'no'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAccommodationDetails(prev => ({ ...prev, outsideHostel: value }))}
                      className={`h-8 min-w-14 rounded-lg border px-4 text-xs font-medium capitalize transition-colors ${
                        accommodationDetails.outsideHostel === value
                          ? 'border-[#2475aa] bg-[#2475aa] text-white'
                          : 'border-[#d4a38d] bg-white text-[#ef6c20]'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-800">Hostel Rating <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => toggleQuestions('accommodation')}
                      data-question-trigger="true"
                      className="w-10 h-4 px-1 py-0 rounded-[6px] bg-[#D9D9D9] text-[#1d1c1c] hover:opacity-80 transition-opacity flex items-center justify-center text-xs font-semibold gap-1"
                      title="View guiding questions"
                    >
                      <span>Q's</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${expandedQuestions.accommodation ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  {expandedQuestions.accommodation && (
                    <div
                      className="absolute right-4 top-7 z-50 bg-white border-2 border-gray-300 rounded-xl shadow-2xl p-4 w-80"
                      data-question-panel="true"
                    >
                      <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                        {FIELD_QUESTIONS.accommodation.map((question, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex gap-2">
                              <span className="text-gray-600 font-bold flex-shrink-0">{idx + 1}.</span>
                              <p className="text-gray-900">{question}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <textarea
                    placeholder="Share your honest hostel experience."
                    value={formData.accommodation}
                    onChange={(e) => setFormData(prev => ({...prev, accommodation: e.target.value}))}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                      validationErrors.accommodation ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#ef6c20]'
                    }`}
                    rows="3"
                  />
                  {validationErrors.accommodation && <p className="text-red-500 text-sm mt-1">{validationErrors.accommodation}</p>}
                </div>
              </>}
            </div>
            </div>}
          </div>

          {/* BLOCK 3: What Every Junior Should Know */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={() => toggleBlock('juniorAdvice')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors sm:px-6"
            >
              <h3 className="text-lg font-bold text-gray-900">What Every Junior Should Know</h3>
              <ChevronDown
                size={22}
                className={`text-gray-600 transition-transform ${expandedBlocks.juniorAdvice ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedBlocks.juniorAdvice && <div className="border-t border-gray-200 p-5 sm:p-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Positives <span className="text-red-500">*</span></label>
                {false && formData.pros.map((positive, index) => (
                  <div key={index} className="flex gap-1.5 mb-2">
                    <input
                      type="text"
                      value={positive}
                      onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                      placeholder="Custom..."
                      className="min-w-0 flex-1 h-7 rounded-md border border-gray-400 px-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2475aa]"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('pros', index)}
                      className="h-7 w-7 rounded-md border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50"
                      aria-label={`Delete positive ${index + 1}`}
                      title="Delete positive"
                    >
                      ×
                    </button>
                    {index === formData.pros.length - 1 && (
                      <button
                        type="button"
                        onClick={() => addArrayItem('pros')}
                        className="h-7 rounded-md bg-[#2475aa] px-3 text-xs font-medium text-white hover:bg-[#1e6493]"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                ))}
                <div className="relative">
                  <div className="flex min-h-24 flex-wrap content-start gap-2 rounded-xl border border-gray-400 p-2 focus-within:border-[#2475aa] focus-within:ring-1 focus-within:ring-[#2475aa]">
                    {formData.pros.filter(Boolean).map((positive, index) => (
                      <span key={positive} className="inline-flex h-7 items-center gap-1 rounded-md bg-[#e3eff6] px-2 text-xs font-medium text-black">
                        {positive}<button data-suggestion-input="true" type="button" onClick={() => removeArrayItem('pros', index)} className="ml-1 text-base leading-none text-black hover:text-red-600" aria-label={`Remove ${positive}`}>&times;</button>
                      </span>
                    ))}
                    <input data-suggestion-input="true" type="text" value={customTag.pros} onClick={() => setSuggestionField(prev => prev === 'pros' ? null : 'pros')} onChange={(e) => setCustomTag(prev => ({ ...prev, pros: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addReviewTag('pros', customTag.pros); } }} placeholder={formData.pros.filter(Boolean).length ? 'Add custom positive...' : 'Choose suggestions or type a custom positive...'} className="h-7 min-w-48 flex-1 bg-transparent px-1 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none" />
                  </div>
                  {suggestionField === 'pros' && <div className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg"><div className="flex flex-wrap gap-1.5">{REVIEW_SUGGESTIONS.pros.map(suggestion => <button key={suggestion} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => addReviewTag('pros', suggestion)} className="rounded-full border border-[#cfe0eb] bg-[#e9f1f7] px-2.5 py-1 text-xs text-black hover:bg-[#e9f1f7]">{suggestion}</button>)}</div></div>}
                </div>
                {validationErrors.pros && <p className="text-red-500 text-sm mt-1">{validationErrors.pros}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Negatives <span className="text-red-500">*</span></label>
                {false && formData.cons.map((negative, index) => (
                  <div key={index} className="flex gap-1.5 mb-2">
                    <input
                      type="text"
                      value={negative}
                      onChange={(e) => handleArrayChange('cons', index, e.target.value)}
                      placeholder="Custom..."
                      className="min-w-0 flex-1 h-7 rounded-md border border-gray-400 px-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#2475aa]"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('cons', index)}
                      className="h-7 w-7 rounded-md border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50"
                      aria-label={`Delete negative ${index + 1}`}
                      title="Delete negative"
                    >
                      ×
                    </button>
                    {index === formData.cons.length - 1 && (
                      <button
                        type="button"
                        onClick={() => addArrayItem('cons')}
                        className="h-7 rounded-md bg-[#2475aa] px-3 text-xs font-medium text-white hover:bg-[#1e6493]"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                ))}
                <div className="relative">
                  <div className="flex min-h-24 flex-wrap content-start gap-2 rounded-xl border border-gray-400 p-2 focus-within:border-[#2475aa] focus-within:ring-1 focus-within:ring-[#2475aa]">
                    {formData.cons.filter(Boolean).map((negative, index) => (
                      <span key={negative} className="inline-flex h-7 items-center gap-1 rounded-md bg-red-100 px-2 text-xs font-medium text-red-800">
                        {negative}<button data-suggestion-input="true" type="button" onClick={() => removeArrayItem('cons', index)} className="ml-1 text-base leading-none text-red-700 hover:text-red-900" aria-label={`Remove ${negative}`}>&times;</button>
                      </span>
                    ))}
                    <input data-suggestion-input="true" type="text" value={customTag.cons} onClick={() => setSuggestionField(prev => prev === 'cons' ? null : 'cons')} onChange={(e) => setCustomTag(prev => ({ ...prev, cons: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addReviewTag('cons', customTag.cons); } }} placeholder={formData.cons.filter(Boolean).length ? 'Add custom negative...' : 'Choose suggestions or type a custom negative...'} className="h-7 min-w-48 flex-1 bg-transparent px-1 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none" />
                  </div>
                  {suggestionField === 'cons' && <div className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg"><div className="flex flex-wrap gap-1.5">{REVIEW_SUGGESTIONS.cons.map(suggestion => <button key={suggestion} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => addReviewTag('cons', suggestion)} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-800 hover:bg-red-100">{suggestion}</button>)}</div></div>}
                </div>
                {validationErrors.cons && <p className="text-red-500 text-sm mt-1">{validationErrors.cons}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Advice To Juniors <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.advice_to_juniors}
                  onChange={(e) => handleInputChange('advice_to_juniors', e.target.value)}
                  placeholder="What advice would you give juniors?"
                  rows="3"
                  className={`w-full resize-none rounded-xl border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                    validationErrors.advice_to_juniors ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'
                  }`}
                />
                {validationErrors.advice_to_juniors && <p className="text-red-500 text-sm mt-1">{validationErrors.advice_to_juniors}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Overall About the College <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.overall_about_college}
                  onChange={(e) => handleInputChange('overall_about_college', e.target.value)}
                  placeholder="Help your brothers & sisters make the right choice."
                  rows="3"
                  className={`w-full resize-none rounded-xl border px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                    validationErrors.overall_about_college ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'
                  }`}
                />
                {validationErrors.overall_about_college && <p className="text-red-500 text-sm mt-1">{validationErrors.overall_about_college}</p>}
              </div>
            </div>
            </div>}
          </div>

          {/* BLOCK 4: Student Information */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={() => toggleBlock('studentInformation')}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors sm:px-6"
            >
              <h3 className="text-lg font-bold text-gray-900">Student Information</h3>
              <ChevronDown size={22} className={`text-gray-600 transition-transform ${expandedBlocks.studentInformation ? 'rotate-180' : ''}`} />
            </button>

            {expandedBlocks.studentInformation && (
              <div className="border-t border-gray-200 p-5 sm:p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-2">Management or EAPCET Seat? <span className="text-red-500">*</span></p>
                    <div className="flex flex-wrap gap-2">
                      {[['management', 'Management'], ['eapcet', 'EAPCET']].map(([value, label]) => (
                        <button key={value} type="button" onClick={() => setStudentInfo(prev => ({ ...prev, seatType: value }))} className={`h-9 w-32 rounded-xl border text-sm font-medium transition-colors ${studentInfo.seatType === value ? 'border-[#2475aa] bg-[#2475aa] text-white' : 'border-[#d4a38d] bg-white text-[#ef6c20]'}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-800 mb-1">EAPCET Rank <span className="text-red-500">*</span></span>
                    <input type="text" value={studentInfo.eapcetRank} onChange={(e) => handleStudentInfoChange('eapcetRank', e.target.value)} placeholder="eg : 5624" className={`w-full h-10 rounded-lg border px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${validationErrors.eapcetRank ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'}`} />
                    {validationErrors.eapcetRank && <p className="text-red-500 text-sm mt-1">{validationErrors.eapcetRank}</p>}
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-800 mb-1">College ID <span className="text-red-500">*</span></span>
                    <input type="text" value={studentInfo.collegeId} onChange={(e) => handleStudentInfoChange('collegeId', e.target.value)} placeholder="eg : 24B91xxxxx" className={`w-full h-10 rounded-lg border px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${validationErrors.collegeId ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'}`} />
                    {validationErrors.collegeId && <p className="text-red-500 text-sm mt-1">{validationErrors.collegeId}</p>}
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <label>
                      <span className="block text-sm font-medium text-gray-800 mb-1">Branch ? <span className="text-red-500">*</span></span>
                      <select value={studentInfo.branch} onChange={(e) => handleStudentInfoChange('branch', e.target.value)} className={`w-full h-10 rounded-lg border bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 ${validationErrors.branch ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'}`}>
                        <option value="">Select branch</option>
                        <option value="CSE">CSE</option>
                        <option value="CSE (AI & ML)">CSE (AI & ML)</option>
                        <option value="CSE (Data Science)">CSE (Data Science)</option>
                        <option value="IT">IT</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Other">Other</option>
                      </select>
                      {validationErrors.branch && <p className="text-red-500 text-sm mt-1">{validationErrors.branch}</p>}
                    </label>
                    <label>
                      <span className="block text-sm font-medium text-gray-800 mb-1">Year ? <span className="text-red-500">*</span></span>
                      <select value={studentInfo.year} onChange={(e) => handleStudentInfoChange('year', e.target.value)} className={`w-full h-10 rounded-lg border bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 ${validationErrors.year ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'}`}>
                        <option value="">Select year</option>
                        <option value="1">1st year</option>
                        <option value="2">2nd year</option>
                        <option value="3">3rd year</option>
                        <option value="4">4th year</option>
                      </select>
                      {validationErrors.year && <p className="text-red-500 text-sm mt-1">{validationErrors.year}</p>}
                    </label>
                  </div>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-800 mb-1">Batch ? <span className="text-red-500">*</span></span>
                    <select value={studentInfo.batch} onChange={(e) => handleStudentInfoChange('batch', e.target.value)} className={`w-full h-10 rounded-lg border bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 ${validationErrors.batch ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'}`}>
                      <option value="">Select batch</option>
                      {Array.from({ length: 10 }, (_, index) => {
                        const startYear = 2020 + index;
                        return <option key={startYear} value={`${startYear} - ${startYear + 1}`}>{startYear} - {startYear + 1}</option>;
                      })}
                    </select>
                    {validationErrors.batch && <p className="text-red-500 text-sm mt-1">{validationErrors.batch}</p>}
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-800 mb-1">Instagram id ? <span className="text-red-500">*</span></span>
                    <input type="text" value={studentInfo.instagramId} onChange={(e) => handleStudentInfoChange('instagramId', e.target.value)} placeholder="eg : your_insta_id" className={`w-full h-10 rounded-lg border px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${validationErrors.instagramId ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'}`} />
                    {validationErrors.instagramId && <p className="text-red-500 text-sm mt-1">{validationErrors.instagramId}</p>}
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-800 mb-1">Name ? <span className="text-red-500">*</span></span>
                    <input type="text" value={studentInfo.name} onChange={(e) => handleStudentInfoChange('name', e.target.value)} placeholder="eg : Johndeo" className={`w-full h-10 rounded-lg border px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-400 focus:ring-[#2475aa]'}`} />
                    {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                  </label>

                  <button type="submit" disabled={isSubmitting} className="w-full h-9 rounded-lg bg-[#2475aa] text-xs font-medium text-white hover:bg-[#1e6493] disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <p className="text-center text-xs text-gray-600">🔒 Your information stays private.</p>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
