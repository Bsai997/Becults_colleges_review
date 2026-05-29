import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';

export default function AddReviewPage() {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    college_id_number: '',
    branch: '',
    year: '',
    batch: '',
    is_hosteller: null,
    college_hostel_available: null,
    outside_hostel: null,
    faculty_rating: 0,
    faculty_reason: '',
    placements_rating: 0,
    placements_reason: '',
    infrastructure_rating: 0,
    infrastructure_reason: '',
    hostel_rating: 0,
    hostel_reason: '',
    pros: [''],
    cons: [''],
    advice_to_juniors: '',
    overall_about_college: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchCollege();
  }, [collegeId]);

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

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.college_id_number.trim()) errors.college_id_number = 'College ID is required';
    if (!formData.branch) errors.branch = 'Branch is required';
    if (!formData.year) errors.year = 'Year is required';
    if (!formData.batch.trim()) errors.batch = 'Batch is required';
    if (formData.is_hosteller === null) errors.is_hosteller = 'Please select Hosteller or Day Scholar';
    if (formData.faculty_rating === 0) errors.faculty_rating = 'Faculty rating is required';
    if (formData.placements_rating === 0) errors.placements_rating = 'Placements rating is required';
    if (formData.infrastructure_rating === 0) errors.infrastructure_rating = 'Infrastructure rating is required';
    if (formData.is_hosteller && formData.hostel_rating === 0) errors.hostel_rating = 'Hostel rating is required';
    if (formData.pros.filter(p => p.trim()).length === 0) errors.pros = 'At least one pro is required';
    if (formData.cons.filter(c => c.trim()).length === 0) errors.cons = 'At least one con is required';
    if (!formData.overall_about_college.trim()) errors.overall_about_college = 'Overall about college is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = {
        college_id: collegeId,
        name: formData.name,
        college_id_number: formData.college_id_number,
        branch: formData.branch,
        year: parseInt(formData.year),
        batch: formData.batch,
        is_hosteller: formData.is_hosteller,
        college_hostel_available: formData.is_hosteller ? formData.college_hostel_available : null,
        outside_hostel: formData.is_hosteller ? formData.outside_hostel : null,
        faculty_rating: formData.faculty_rating,
        faculty_reason: formData.faculty_reason,
        placements_rating: formData.placements_rating,
        placements_reason: formData.placements_reason,
        infrastructure_rating: formData.infrastructure_rating,
        infrastructure_reason: formData.infrastructure_reason,
        hostel_rating: formData.is_hosteller ? formData.hostel_rating : null,
        hostel_reason: formData.is_hosteller ? formData.hostel_reason : null,
        pros: formData.pros.filter(p => p.trim()),
        cons: formData.cons.filter(c => c.trim()),
        advice_to_juniors: formData.advice_to_juniors,
        overall_about_college: formData.overall_about_college
      };

      await api.post('/reviews', submitData);
      setSuccessMessage('Thanks for your honest feedback!');

      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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

      <div className="max-w-2xl mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* College Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{college.name}</h1>
        <p className="text-gray-600 mb-6">{college.location}</p>

        {/* Quote Banner */}
        <div className="bg-green-50 border-l-4 border-becults-green px-4 py-4 mb-8">
          <p className="text-gray-700 italic">
            "Please write reviews honestly — it will be useful for many future engineers to choose the correct college."
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Section 1: Student Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Information</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 21EG1A0501"
                value={formData.college_id_number}
                onChange={(e) => handleInputChange('college_id_number', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green ${
                  validationErrors.college_id_number ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.college_id_number && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.college_id_number}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green ${
                    validationErrors.branch ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="IT">IT</option>
                  <option value="EEE">EEE</option>
                </select>
                {validationErrors.branch && <p className="text-red-500 text-sm mt-1">{validationErrors.branch}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green ${
                    validationErrors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Year</option>
                  <option value="1">1st year</option>
                  <option value="2">2nd year</option>
                  <option value="3">3rd year</option>
                  <option value="4">4th year</option>
                </select>
                {validationErrors.year && <p className="text-red-500 text-sm mt-1">{validationErrors.year}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2022-2026"
                value={formData.batch}
                onChange={(e) => handleInputChange('batch', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green ${
                  validationErrors.batch ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.batch && <p className="text-red-500 text-sm mt-1">{validationErrors.batch}</p>}
            </div>
          </div>

          {/* Section 2: Ratings */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ratings</h2>

            <div>
              <StarRating
                label="Faculty Rating"
                required
                value={formData.faculty_rating}
                onChange={(value) => handleInputChange('faculty_rating', value)}
              />
              {validationErrors.faculty_rating && (
                <p className="text-red-500 text-sm mb-4">{validationErrors.faculty_rating}</p>
              )}
              <div className="mb-6">
                <textarea
                  placeholder="Why did you rate faculty this way? (optional)"
                  value={formData.faculty_reason}
                  onChange={(e) => handleInputChange('faculty_reason', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green"
                  rows="3"
                />
              </div>
            </div>

            <div>
              <StarRating
                label="Placements Rating"
                required
                value={formData.placements_rating}
                onChange={(value) => handleInputChange('placements_rating', value)}
              />
              {validationErrors.placements_rating && (
                <p className="text-red-500 text-sm mb-4">{validationErrors.placements_rating}</p>
              )}
              <div className="mb-6">
                <textarea
                  placeholder="Why did you rate placements this way? (optional)"
                  value={formData.placements_reason}
                  onChange={(e) => handleInputChange('placements_reason', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green"
                  rows="3"
                />
              </div>
            </div>

            <div>
              <StarRating
                label="Infrastructure Rating"
                required
                value={formData.infrastructure_rating}
                onChange={(value) => handleInputChange('infrastructure_rating', value)}
              />
              {validationErrors.infrastructure_rating && (
                <p className="text-red-500 text-sm mb-4">{validationErrors.infrastructure_rating}</p>
              )}
              <div>
                <textarea
                  placeholder="Why did you rate infrastructure this way? (optional)"
                  value={formData.infrastructure_reason}
                  onChange={(e) => handleInputChange('infrastructure_reason', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Accommodation */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Accommodation</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Are you a Hosteller or Day Scholar? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('is_hosteller', true)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    formData.is_hosteller === true
                      ? 'bg-becults-green text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Hosteller
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('is_hosteller', false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    formData.is_hosteller === false
                      ? 'bg-becults-green text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Day Scholar
                </button>
              </div>
              {validationErrors.is_hosteller && (
                <p className="text-red-500 text-sm mt-2">{validationErrors.is_hosteller}</p>
              )}
            </div>

            {formData.is_hosteller === true && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    College hostel facilities available?
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('college_hostel_available', true)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        formData.college_hostel_available === true
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('college_hostel_available', false)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        formData.college_hostel_available === false
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Staying in outside hostel?
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('outside_hostel', true)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        formData.outside_hostel === true
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('outside_hostel', false)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        formData.outside_hostel === false
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <StarRating
                    label="Hostel Rating"
                    required
                    value={formData.hostel_rating}
                    onChange={(value) => handleInputChange('hostel_rating', value)}
                  />
                  {validationErrors.hostel_rating && (
                    <p className="text-red-500 text-sm mb-4">{validationErrors.hostel_rating}</p>
                  )}
                  <div className="mb-6">
                    <textarea
                      placeholder="Why did you rate hostel this way? (optional)"
                      value={formData.hostel_reason}
                      onChange={(e) => handleInputChange('hostel_reason', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Written Review */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Written Review</h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pros <span className="text-red-500">*</span>
              </label>
              {formData.pros.map((pro, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    placeholder={`Pro ${index + 1}`}
                    value={pro}
                    onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green"
                  />
                </div>
              ))}
              {validationErrors.pros && <p className="text-red-500 text-sm mb-2">{validationErrors.pros}</p>}
              <button
                type="button"
                onClick={() => addArrayItem('pros')}
                className="mt-2 px-4 py-2 bg-becults-green text-white rounded-lg hover:bg-becults-dark transition-colors"
              >
                + Add another pro
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cons <span className="text-red-500">*</span>
              </label>
              {formData.cons.map((con, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    placeholder={`Con ${index + 1}`}
                    value={con}
                    onChange={(e) => handleArrayChange('cons', index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green"
                  />
                </div>
              ))}
              {validationErrors.cons && <p className="text-red-500 text-sm mb-2">{validationErrors.cons}</p>}
              <button
                type="button"
                onClick={() => addArrayItem('cons')}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                + Add another con
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advice to Juniors 
              </label>
              <textarea
                placeholder="What advice would you give to future students?"
                value={formData.advice_to_juniors}
                onChange={(e) => handleInputChange('advice_to_juniors', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green"
                rows="4"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall About the College <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Share your overall thoughts about the college..."
                value={formData.overall_about_college}
                onChange={(e) => handleInputChange('overall_about_college', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green ${
                  validationErrors.overall_about_college ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="4"
              />
              {validationErrors.overall_about_college && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.overall_about_college}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-becults-green text-white font-bold rounded-lg hover:bg-becults-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
