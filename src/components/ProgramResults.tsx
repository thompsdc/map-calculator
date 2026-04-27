import { useState, useRef, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { ProgramResult } from '../types';

const MAC_PROGRAMS_URL = 'http://mapsci.ca/level-2-programs/';
const PAGE_SIZE = 5;
const GREEN = '#0E5B3D';
const GREY = '#efefef';

interface ProgramResultsProps {
  results: ProgramResult[];
  onClose: () => void;
}

function ProgramCard({ program }: { program: ProgramResult }) {
  const pct = Math.round(program.programPercentage * 100);
  const chartData = [
    { name: 'Satisfied', value: program.programPercentage },
    { name: 'Unsatisfied', value: 1 - program.programPercentage },
  ];

  return (
    <div
      className="shadow-md rounded-lg p-4 mb-4"
      tabIndex={0}
      aria-label={`${program.programName} is ${pct}% complete`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#5e6a71] mb-1">{program.programName}</h3>
          {program.programSlug && (
            <a
              href={MAC_PROGRAMS_URL + program.programSlug}
              target="_blank"
              rel="noreferrer"
              className="text-[#7a003c] hover:underline text-sm"
            >
              Learn More
            </a>
          )}
          <div className="mt-3">
            <strong className="text-sm">Requirements</strong>
            <ul className="mt-1 list-disc list-inside text-sm space-y-1">
              {program.programRequirements.map((req, i) => (
                <li key={i}>
                  <strong>
                    {req.fulfilled * 3}/{req.total * 3} units
                  </strong>{' '}
                  from{' '}
                  {req.label.split(', ').map((code, j) => {
                    const isFulfilled = req.courses.includes(code);
                    return (
                      <span key={j}>
                        {j > 0 && ', '}
                        {isFulfilled ? <strong className="text-[#0E5B3D]">{code}</strong> : code}
                      </span>
                    );
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0">
          <PieChart width={140} height={140}>
            <Pie
              data={chartData}
              cx={65}
              cy={65}
              innerRadius={0}
              outerRadius={55}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={GREEN} />
              <Cell fill={GREY} />
            </Pie>
            <Tooltip
              formatter={(value: number) => `${Math.round(value * 100)}%`}
            />
          </PieChart>
          <span className="text-sm font-bold text-[#5e6a71] -mt-1">{pct}%</span>
        </div>
      </div>
    </div>
  );
}

export function ProgramResults({ results, onClose }: ProgramResultsProps) {
  const [page, setPage] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = useMemo(
    () => results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [results, page]
  );

  const goTo = (p: number) => {
    setPage(p);
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination numbers
  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  }, [page, totalPages]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col" style={{ maxHeight: 'calc(100vh - 3.5rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#7a003c] rounded-t-lg">
          <h2 className="text-white text-xl font-bold">Program Results</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl cursor-pointer focus:outline-none"
            aria-label="Close results"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-6">
          {pageResults.map((program) => (
            <ProgramCard key={program.programId} program={program} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center gap-3 px-6 py-4 border-t">
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumbers[0] > 1 && <span className="px-1 text-gray-400">…</span>}

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => goTo(n)}
                  className={`w-8 h-8 rounded text-sm font-medium cursor-pointer transition-colors ${
                    n === page
                      ? 'bg-[#7a003c] text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {n}
                </button>
              ))}

              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <span className="px-1 text-gray-400">…</span>
              )}

              <button
                onClick={() => goTo(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="self-end px-6 py-2 bg-[#7a003c] text-white rounded hover:bg-[#5e6a71] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
