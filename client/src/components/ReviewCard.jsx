import ProConsTable from './ProConsTable';

export default function ReviewCard({ review }) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 md:w-4 md:h-4 ${
              i < fullStars
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

  const getOverallRatingColor = (rating) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatYear = (year) => {
    const yearMap = { 1: '1st year', 2: '2nd year', 3: '3rd year', 4: '4th year' };
    return yearMap[year] || year;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6 gap-3 md:gap-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-sm md:text-lg flex-shrink-0">
            {getInitials(review.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{review.name}</h3>
            <p className="text-xs md:text-sm text-gray-600">
              {review.branch} • {formatYear(review.year)} • Batch {review.batch} • ID: {review.college_id_number}
            </p>
            {/* Accommodation Badge */}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                {review.is_hosteller ? 'Hosteller' : 'Day Scholar'}
              </span>
              
              {/* Hostel Availability */}
              {review.is_hosteller && (
                <>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${review.college_hostel_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   College Hostel: {review.college_hostel_available ? 'Present' : 'Not Present'}
                  </span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${review.outside_hostel ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    Outside Hostel: {review.outside_hostel ? 'Present' : 'Not Present'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Overall Rating Badge */}
        <div className="flex-shrink-0 text-center">
          <div className="text-2xl md:text-3xl font-bold text-becults-green mb-1">{review.overall_rating}</div>
          <div className="flex justify-center gap-0.5">
            {renderStars(review.overall_rating)}
          </div>
        </div>
      </div>

      {/* Ratings Grid - Responsive 2 columns on mobile, 3-4 on desktop */}
      <div className={`grid ${review.is_hosteller ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'} gap-3 md:gap-4 mb-6`}>
        {/* Faculty Rating */}
        <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Faculty</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg md:text-xl font-bold text-gray-900">{review.faculty_rating}</span>
            {renderStars(review.faculty_rating)}
          </div>
          <p><b>Reason : </b></p>
          {review.faculty_reason && <p className="text-xs md:text-sm text-gray-700 italic">"{review.faculty_reason}"</p>}
        </div>

        {/* Placements Rating */}
        <div className="bg-green-50 p-3 md:p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Placements</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg md:text-xl font-bold text-gray-900">{review.placements_rating}</span>
            {renderStars(review.placements_rating)}
          </div>
          <p><b>Reason : </b></p>
          {review.placements_reason && <p className="text-xs md:text-sm text-gray-700 italic">"{review.placements_reason}"</p>}
        </div>

        {/* Infrastructure Rating */}
        <div className="bg-purple-50 p-3 md:p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Infrastructure</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg md:text-xl font-bold text-gray-900">{review.infrastructure_rating}</span>
            {renderStars(review.infrastructure_rating)}
          </div>
          <p><b>Reason : </b></p>
          {review.infrastructure_reason && <p className="text-xs md:text-sm text-gray-700 italic">"{review.infrastructure_reason}"</p>}
        </div>

        {/* Hostel Rating - Only for Hostellers */}
        {review.is_hosteller && (
          <div className="bg-orange-50 p-3 md:p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Hostel</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg md:text-xl font-bold text-gray-900">{review.hostel_rating || 0}</span>
              {renderStars(review.hostel_rating || 0)}
            </div>
            <p><b>Reason : </b></p>
            {review.hostel_reason && <p className="text-xs md:text-sm text-gray-700 italic">"{review.hostel_reason}"</p>}
          </div>
        )}
      </div>
      
      {/* Overall About Heading */}
      <h3 className="font-bold text-lg text-gray-900 mb-3">Overall about college</h3>
      
      {/* Overall About Section */}
      {review.overall_about_college && (
        <div className="mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
          <p className="text-sm md:text-base text-gray-800 italic">"{review.overall_about_college}"</p>
        </div>
      )}

      {/* Pros and Cons Table */}
      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="mb-6">
          <ProConsTable pros={review.pros} cons={review.cons} />
        </div>
      )}
 <h3 className="font-bold text-lg text-gray-900 mb-3">Advice to Juniors</h3>
      
      {/* Advice to Juniors */}
      {review.advice_to_juniors && (
        <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
          {/* <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Advice to juniors:</h4> */}
          <p className="text-sm md:text-base text-gray-800 font-semibold">"{review.advice_to_juniors}"</p>
        </div>
      )}
    </div>
  );
}
