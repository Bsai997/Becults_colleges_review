import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import CollegeCard from '../components/CollegeCard';
import SkeletonLoader from '../components/SkeletonLoader';

export default function HomePage() {
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized function prevents unnecessary component re-renders
  const fetchTop10Colleges = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/colleges/top10');
      setColleges(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError('Please refresh the page to load the colleges.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTop10Colleges();
  }, [fetchTop10Colleges]);

  return (
    <div className="min-h-screen bg-[#eaf3fb] text-slate-900">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f4f8fd_0%,#eaf3fb_100%)] px-4 pt-10 pb-6 md:pt-14 md:pb-8">
        <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top_left,rgba(0,102,204,0.14),transparent_45%),radial-gradient(circle_at_top_right,rgba(243,116,32,0.18),transparent_35%)]" />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm backdrop-blur">
            BECULTS
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#1A699F] md:text-6xl"> 
            College <span className="text-[#0e0f10] font-sans font-extrabold cd fr "> Reviews</span> 
            <span className="block text-slate-800">by <span className="text-[#ef6c20]">College Students</span></span> 
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-600 md:text-base"> 
            Search, compare, and open real student reviews in one place. 
          </p>
        </div>
      </div>

      <div className="px-4 pb-10">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-sky-100 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur md:p-5">
          <SearchBar />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-12 md:pb-16">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="mt-1 text-sm text-slate-600">The most reviewed colleges on the platform.</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            {colleges.length} listed
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        ) : colleges.length === 0 ? (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-700 shadow-sm">
            No colleges found. Be the first to add a review!
          </div>
        ) : (
          <div className="space-y-4">
            {colleges.map((college, index) => (
              <CollegeCard 
                key={college.id} 
                rank={index + 1} 
                id={college.id} 
                name={college.name} 
                location={college.location} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
