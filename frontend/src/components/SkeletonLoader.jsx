export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md p-3 md:p-5 mb-4 border border-gray-100 animate-pulse"
        >
          <div className="flex items-center gap-3 flex-1">
            {/* Rank Badge Skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>

            {/* College Info Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Rating Skeleton */}
            <div className="hidden md:flex items-center gap-2">
              <div className="h-6 bg-gray-300 rounded w-12"></div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-4 h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="hidden md:flex gap-2">
              <div className="w-24 h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-24 h-10 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
