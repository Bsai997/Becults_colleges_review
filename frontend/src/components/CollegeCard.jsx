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
    <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(15,23,42,0.12)] md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
            {rank}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[1.05rem] font-semibold text-slate-900 md:text-[1.15rem]">{name}</h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
              <svg className="h-4 w-4 flex-shrink-0 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="truncate">{location}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {['College life', 'Placements', 'Faculty', 'Events', 'Hostel'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#f4c9b0] bg-[#fff7f2] px-2.5 py-1 text-[10px] font-medium text-[#ef6c20]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">{total_reviews} Reviews</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:w-[320px]">
          {/* <div className="flex items-center justify-end gap-2 md:gap-3">
            <span className="font-semibold text-slate-900 text-base md:text-lg">{average_rating}</span>
            {renderStars(average_rating)}
          </div> */}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddReview}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f0b394] bg-white px-4 py-3 text-sm font-semibold text-[#ef6c20] transition-colors hover:bg-[#fff3eb]"
            >
              Add Review
            </button>
            <button
              onClick={handleOpenReview}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2067a3] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#195784]"
            >
              Open Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CollegeCard);
