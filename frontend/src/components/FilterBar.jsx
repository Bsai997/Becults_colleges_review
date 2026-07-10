export default function FilterBar({ filters, onChange }) {
  const branches = ['', 'CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE'];
  const years = ['', '1', '2', '3', '4'];

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-lg border border-gray-200">
      {/* Branch Dropdown */}
      <div className="flex-1">
        <select
          value={filters.branch || ''}
          onChange={(e) => onChange('branch', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green text-gray-700 bg-white"
        >
          <option value="">All Branches</option>
          {branches.map(branch => (
            branch && <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {/* Year Dropdown */}
      <div className="flex-1">
        <select
          value={filters.year || ''}
          onChange={(e) => onChange('year', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green text-gray-700 bg-white"
        >
          <option value="">All Years</option>
          <option value="1">1st year</option>
          <option value="2">2nd year</option>
          <option value="3">3rd year</option>
          <option value="4">4th year</option>
        </select>
      </div>

      {/* Type Dropdown */}
      <div className="flex-1">
        <select
          value={filters.type || ''}
          onChange={(e) => onChange('type', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-becults-green text-gray-700 bg-white"
        >
          <option value="">All Types</option>
          <option value="hosteller">Hosteller</option>
          <option value="dayscholar">Day Scholar</option>
        </select>
      </div>
    </div>
  );
}
