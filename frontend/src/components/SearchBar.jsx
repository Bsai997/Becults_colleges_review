import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        searchColleges();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const searchColleges = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/colleges/search', {
        params: { q: query }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching colleges:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (collegeId) => {
    navigate(`/reviews/${collegeId}`);
    setQuery('');
    setResults([]);
  };

  const handleAddReview = (collegeId, e) => {
    e.stopPropagation();
    navigate(`/add-review/${collegeId}`);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search colleges..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[20px] border border-[#ccd6dcfc] bg-[#EDF5FAFC] px-5 py-4 pr-14 text-base text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"></div>
          </div>
        )}
        {!isLoading && query && (
          <svg className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-3 max-h-96 overflow-y-auto rounded-[22px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          {results.map((college) => (
            <div
              key={college.id}
              className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-slate-900">{college.name}</div>
                <div className="truncate text-xs text-slate-500">{college.location}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={(e) => handleAddReview(college.id, e)}
                  className="flex items-center gap-1 whitespace-nowrap rounded-full border border-[#f0b394] px-3 py-1.5 text-xs font-semibold text-[#ef6c20] transition-colors hover:bg-[#fff3eb]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Add
                </button>
                <button
                  onClick={() => handleSelect(college.id)}
                  className="flex items-center gap-1 whitespace-nowrap rounded-full bg-[#2067a3] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#195784]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
