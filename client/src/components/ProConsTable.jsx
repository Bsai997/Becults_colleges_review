export default function ProConsTable({ pros, cons }) {
  const maxLength = Math.max(pros.length, cons.length);
  const rows = Array.from({ length: maxLength }, (_, i) => ({
    pro: pros[i] || '',
    con: cons[i] || ''
  }));

  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm md:text-base">
        <thead>
          <tr>
            <th className="bg-green-100 text-black px-3 md:px-4 py-2 text-left">Pros about college</th>
            <th className="bg-red-100 text-black px-3 md:px-4 py-2 text-left">Cons about college</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-3 md:px-4 py-2 border-b border-r border-gray-200">
                {row.pro && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 font-bold text-lg flex-shrink-0">✓</span>
                    <span className="text-gray-700">{row.pro}</span>
                  </div>
                )}
              </td>
              <td className="px-5 md:px-6 py-2 border-b border-gray-200">
                {row.con && (
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold text-lg flex-shrink-0">✕</span>
                    <span className="text-gray-700">{row.con}</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
