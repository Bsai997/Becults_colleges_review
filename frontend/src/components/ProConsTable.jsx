export default function ProConsTable({ pros, cons }) {
  return (
    <div className="my-4 space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Positives <span className="text-gray-400">*</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {pros.map((item, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-[#EEF5FA] text-gray-700 text-medium md:text-base whitespace-nowrap border-[#c4daf1] border"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Negatives <span className="text-gray-400">*</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {cons.map((item, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-[#FFF1EA] text-orange-600 text-sm md:text-base whitespace-nowrap border-[#f4c9b0] border"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}