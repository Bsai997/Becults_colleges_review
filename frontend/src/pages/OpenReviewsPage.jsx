import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FilterBar from '../components/FilterBar';
import ReviewCard from '../components/ReviewCard';

export default function OpenReviewsPage() {
  const { collegeId } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    branch: '',
    year: '',
    type: ''
  });

  useEffect(() => {
    fetchCollegeData();
  }, [collegeId]);

  useEffect(() => {
    fetchReviews(1);
  }, [filters]);

  const fetchCollegeData = async () => {
    try {
      setIsLoading(true);
      const [collegeRes, statsRes] = await Promise.all([
        api.get(`/colleges/${collegeId}`),
        api.get(`/colleges/${collegeId}/stats`)
      ]);

      setCollege(collegeRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching college data:', err);
      setError('Failed to load college details.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async (page = 1) => {
    try {
      const params = {
        page: page,
        ...(filters.branch && { branch: filters.branch }),
        ...(filters.year && { year: filters.year }),
        ...(filters.type && { type: filters.type })
      };

      const response = await api.get(`/reviews/${collegeId}`, { params });

      if (page === 1) {
        setReviews(response.data.reviews);
      } else {
        setReviews(prev => [...prev, ...response.data.reviews]);
      }

      setCurrentPage(response.data.page);
      setTotalPages(response.data.total_pages);
      setTotalCount(response.data.total_count);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews.');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    fetchReviews(currentPage + 1);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : i < fullStars + (hasHalfStar ? 1 : 0)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderSmallStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${
              i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 text-becults-green border border-becults-green rounded-lg hover:bg-becults-green hover:text-white transition-colors"
        >
          ← Back
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error || 'College not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 text-becults-green border border-becults-green rounded-lg hover:bg-becults-green hover:text-white transition-colors flex items-center gap-2 text-sm md:text-base"
        >
          ← Back to Home
        </button>

        {/* College Header Card */}
        {college && reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 border border-gray-200">
            {/* College Name and Location */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{college.name}</h1>
              <div className="flex items-center gap-1 text-gray-600 mt-2 text-xs md:text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>{college.location}</span>
                <span>•</span>
                <span>{college.affiliation || 'Engineering College'}</span>
              </div>
            </div>

            {/* Overall Rating Section */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex flex-col items-start">
                <div className="text-4xl md:text-5xl font-bold text-gray-900">{stats?.average_overall_rating || 0}</div>
                <div className="flex gap-1 mt-2">
                  {renderStars(stats?.average_overall_rating || 0)}
                </div>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  Based on <span className="font-bold">{stats?.total_reviews || 0}</span> student reviews
                </p>
              </div>
            </div>

            {/* Rating Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Faculty */}
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Faculty</p>
                  <p className="text-sm font-bold text-gray-900">{stats?.average_faculty_rating || 0}</p>
                  <div className="flex gap-0.5">{renderSmallStars(stats?.average_faculty_rating || 0)}</div>
                </div>
              </div>

              {/* Placements */}
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Placements</p>
                  <p className="text-sm font-bold text-gray-900">{stats?.average_placements_rating || 0}</p>
                  <div className="flex gap-0.5">{renderSmallStars(stats?.average_placements_rating || 0)}</div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Infrastructure</p>
                  <p className="text-sm font-bold text-gray-900">{stats?.average_infrastructure_rating || 0}</p>
                  <div className="flex gap-0.5">{renderSmallStars(stats?.average_infrastructure_rating || 0)}</div>
                </div>
              </div>

              {/* Hostel */}
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 9h6m0 0l-1-3H9l-1 3" />
                </svg>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Hostel</p>
                  <p className="text-sm font-bold text-gray-900">{stats?.average_hostel_rating || 0}</p>
                  <div className="flex gap-0.5">{renderSmallStars(stats?.average_hostel_rating || 0)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <FilterBar filters={filters} onChange={handleFilterChange} />

        {/* Reviews Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium text-sm md:text-base">
            {totalCount === 0 ? 'No reviews' : `${totalCount} review${totalCount !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-4 rounded-lg text-center">
            No reviews yet. Be the first to add one!
          </div>
        ) : (
          <div>
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-becults-green text-white font-medium rounded-lg hover:bg-becults-dark transition-colors"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
