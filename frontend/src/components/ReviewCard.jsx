
import { useState } from 'react';
import ProConsTable from './ProConsTable';

const formatYear = (year) => {
  const years = { 1: '1st year', 2: '2nd year', 3: '3rd year', 4: '4th year' };
  return years[year] || year;
};

const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

const maskCollegeId = (idNumber) => {
  if (!idNumber) return '';
  return `${idNumber.slice(0, 6)}XXXX`;
};

const EXPANDABLE_SECTIONS = [
  ['faculty', 'Faculty'],
  ['placements', 'Placements'],
  ['tech_events', 'Events'],
  ['infrastructure', 'Infrastructure'],
  ['college_life', 'College life'],
  ['accommodation', 'Hostel life'],
];

export default function ReviewCard({ review }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const availableSections = EXPANDABLE_SECTIONS.filter(([key]) => review[key]);

  return (
    <article className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="truncate font-semibold tracking-wide text-slate-900">
                {maskCollegeId(review.college_id_number)}
              </h2>
            </div>
          </div>
          {review.created_at && <time className="shrink-0 text-xs text-slate-400">{formatDate(review.created_at)}</time>}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#2475aa] px-2.5 py-1 text-xs font-medium text-white">
            {review.branch || 'Branch not shared'}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {formatYear(review.year)}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {review.batch || '—'}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#2475aa]/40 px-2.5 py-1 text-xs font-medium text-[#2475aa]">
            {review.is_hosteller ? 'Hosteller' : 'Day Scholar'}
          </span>
          {review.is_hosteller && (
            <span className="rounded-full border border-[#2475aa]/40 px-2.5 py-1 text-xs font-medium text-[#2475aa]">
              {review.outside_hostel ? 'Hostel: Outside' : 'Hostel: in College'}
            </span>
          )}
          {review.admission_type && (
            <span className="rounded-full border border-[#D3540D]/40 bg-[#D3540D]/10 px-2.5 py-1 text-xs font-medium capitalize text-[#D3540D]">
              {review.admission_type} seat
            </span>
          )}
        </div>
      </header>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        {review.overall_about_college && (
          <section>
            <h3 className="mb-1.5 text-sm font-semibold text-slate-900">Overall About the College</h3>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-sm   text-black fontweight:extrabold">
              "{review.overall_about_college}"
            </p>
          </section>
        )}

        {review.advice_to_juniors && (
          <section>
            <h3 className="mb-1.5 text-sm font-semibold text-slate-900">Advice To Juniors</h3>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-3 text-sm  text-black fontweight:extrabold">
              "{review.advice_to_juniors}"
            </p>
          </section>
        )}

        {(review.pros?.length > 0 || review.cons?.length > 0) && (
          <section>
            <ProConsTable pros={review.pros || []} cons={review.cons || []} />
          </section>
        )}

        {availableSections.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5">
            {availableSections.map(([key, label]) => {
              const isOpen = openSection === key;
              return (
                <div key={key} className={isOpen ? 'col-span-2' : ''}>
                  <button
                    type="button"
                    onClick={() => toggleSection(key)}
                    className="flex w-full items-center justify-between rounded-[80px] bg-[#2475aa] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1e6493] "
                  >
                    {label}
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                  {isOpen && (
                    <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                      {review[key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}