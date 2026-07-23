import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import ReviewCard from '../components/ReviewCard';

export default function OpenReviewsPage() {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({ branch: '', year: '', type: '' });
  const [branchOptions, setBranchOptions] = useState([]);

  const fetchReviews = async (page = 1) => {
    try {
      const params = {
        page,
        ...(filters.branch && { branch: filters.branch }),
        ...(filters.year && { year: filters.year }),
        ...(filters.type && { type: filters.type }),
      };
      const response = await api.get(`/reviews/${collegeId}`, {
        params,
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = response.data;
      setReviews(previous => (page === 1 ? data.reviews : [...previous, ...data.reviews]));
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
      setError(null);

      // Build branch dropdown options from whatever branches actually
      // appear in this college's reviews (only worth doing on page 1,
      // unfiltered — otherwise the list would shrink as filters narrow it)
      if (page === 1 && !filters.branch) {
        const uniqueBranches = [...new Set(data.reviews.map(r => r.branch))];
        setBranchOptions(prev => (prev.length ? prev : uniqueBranches));
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews.');
    }
  };

  useEffect(() => {
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
    fetchCollege();
  }, [collegeId]);

  useEffect(() => {
    fetchReviews(1);
  }, [collegeId, filters]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2475aa] border-t-transparent" />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <button type="button" onClick={() => navigate('/')} className="mb-5 text-sm font-medium text-[#2475aa]">
          ← Back to Home
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error || 'College not found'}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fd] px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <button type="button" onClick={() => navigate('/')} className="mb-5 text-sm font-medium text-[#2475aa] hover:text-[#1e6493]">
          ← Back to Home
        </button>

        {/* Hero heading — matches screenshot */}
        <h1 className="mb-1 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl font-sans">
          Make the <br /><span className="text-[#2475aa] font-sans font-extrabold cd fr ">Right Choice with</span>
        </h1>
        <h1 className="mb-5 text-3xl font-extrabold leading-tight text-[#D3540D] sm:text-4xl font-sans">
          Senior Suggestions
        </h1>

        <div className="mb-4 font-bold text-slate-500 space-y-1">
          {/* 1. College Name */}
          <h1 className="mb-5 text-3xl font-extrabold leading-tight text-[#1e1f20] sm:text-4xl font-sans">
          {college.name}
        </h1>
          {/* 2. Location with Location Icon */}
          {college.location && (
            <p className="flex items-center gap-1.5">
              {/* Map Pin / Location SVG Icon */}
              <svg
                className="w-4 h-4 text-slate-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{college.location}</span>
            </p>
          )}

          {/* 3. Affiliated By (Below Location) */}
          {/* {college.affiliation && (
            <p>
              <span>Affiliated by: </span>
              {college.affiliation}
            </p>
          )} */}
        </div>
        {/* Branch dropdown — matches "Select Branch" pill in screenshot */}
        <div className="relative mb-6">
          <select
            value={filters.branch}
            onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
            className="w-full appearance-none rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm focus:border-[#2475aa] focus:outline-none"
          >
            <option value="">Select Branch</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Student reviews</h2>
          <span className="text-sm text-slate-500">{totalCount} review{totalCount === 1 ? '' : 's'}</span>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-slate-500">
            No reviews yet. Be the first to add one.
          </div>
        ) : (
          <>
            {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
            {currentPage < totalPages && (
              <div className="mt-7 text-center">
                <button
                  type="button"
                  onClick={() => fetchReviews(currentPage + 1)}
                  className="rounded-lg bg-[#2475aa] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1e6493]"
                >
                  Load more reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}