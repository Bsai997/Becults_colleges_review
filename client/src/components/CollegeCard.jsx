import { useNavigate } from 'react-router-dom';
import { useCallback, memo } from 'react';

function CollegeCard({
  rank,
  id,
  name,
  location,
  average_rating,
  total_reviews
}) {
  const navigate = useNavigate();

  const handleAddReview = useCallback(() => {
    navigate(`/add-review/${id}`);
  }, [id, navigate]);

  const handleOpenReview = useCallback(() => {
    navigate(`/reviews/${id}`);
  }, [id, navigate]);

  const getRankBadgeColor = () => {
    switch (rank) {
      case 1:
        return 'bg-yellow-200';
      case 2:
        return 'bg-gray-400';
      case 3:
        return 'bg-orange-200';
      default:
        return 'bg-gray-300';
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
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

  return (
    <div className="bg-white rounded-lg shadow-md p-3 md:p-5 mb-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-lg transition-shadow border border-gray-100 gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Rank Badge */}
        <div
          className={`${getRankBadgeColor()} text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
        >
          {rank}
        </div>

        {/* College Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">{name}</h3>
          <div className="flex items-center gap-1 text-gray-600">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-xs md:text-sm truncate">{location}</p>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="flex items-center gap-2 md:gap-3 md:mx-4 flex-shrink-0">
        <div className="flex flex-col items-center">
          <div className="flex gap-1 items-center">
            <span className="font-bold text-gray-900 text-sm md:text-base">{average_rating}</span>
            {renderStars(average_rating)}
          </div>
          <p className="text-xs text-gray-500">· {total_reviews} reviews</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
        <button
          onClick={handleAddReview}
          className="flex-1 md:flex-none px-3 md:px-6 py-2 border-2 border-becults-green text-becults-green rounded-lg font-medium text-sm md:text-base hover:bg-becults-green hover:text-white transition-colors flex items-center justify-center gap-1 md:gap-2"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="hidden md:inline">Add review</span>
          <span className="md:hidden text-xs">Add review</span>
        </button>
        <button
          onClick={handleOpenReview}
          className="flex-1 md:flex-none px-3 md:px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium text-sm md:text-base hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 md:gap-2"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden md:inline">Open Review</span>
          <span className="md:hidden text-xs">Open Review</span>
        </button>
      </div>
    </div>
  );
}

export default memo(CollegeCard);
