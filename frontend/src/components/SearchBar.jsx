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
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green placeholder-gray-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-becults-green border-t-transparent rounded-full"></div>
          </div>
        )}
        {!isLoading && query && (
          <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((college) => (
            <div
              key={college.id}
              className="px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3"
            >
              <div className="font-medium text-gray-800 flex-1 min-w-0">{college.name}</div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={(e) => handleAddReview(college.id, e)}
                  className="px-3 py-1.5 border-2 border-becults-green text-becults-green rounded-lg font-medium text-xs hover:bg-becults-green hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Add
                </button>
                <button
                  onClick={() => handleSelect(college.id)}
                  className="px-3 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-xs hover:border-gray-400 hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-1"
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
