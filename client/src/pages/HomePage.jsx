import { useState, useEffect } from 'react';
import api from '../api/axios';
import SearchBar from '../components/SearchBar';
import CollegeCard from '../components/CollegeCard';

export default function HomePage() {
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTop10Colleges();
  }, []);

  const fetchTop10Colleges = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/colleges/top10');
      setColleges(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setError('Failed to load colleges. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-becults-dark text-white py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">BECULTS</h1>
          <h2 className="text-xl md:text-3xl font-semibold mb-3 text-gray-200">College Reviews Platform</h2>
          <p className="text-sm md:text-lg text-gray-300">
            Real reviews by real B.Tech students. Find the right college.
          </p>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* Top 10 Colleges Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Top 10 Colleges</h2> */}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-becults-green border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : colleges.length === 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
            No colleges found. Be the first to add a review!
          </div>
        ) : (
          <div>
            {colleges.map((college, index) => (
              <CollegeCard
                key={college.id}
                rank={index + 1}
                id={college.id}
                name={college.name}
                location={college.location}
                average_rating={college.average_rating}
                total_reviews={college.total_reviews}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
