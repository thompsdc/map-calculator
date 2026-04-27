import { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { CourseListing } from '../types';
import type { AntirequisiteInfo } from '../hooks/useAntirequisites';
import { searchForCourse } from '../lib/search';
import { CourseCard } from './CourseCard';

interface SearchBarProps {
  onAddCourse: (course: CourseListing) => void;
  antirequisites: AntirequisiteInfo;
}

export function SearchBar({ onAddCourse, antirequisites }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<CourseListing[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback((term: string) => {
    if (term.length === 0 || term.length > 30) {
      setResults([]);
      if (term.length > 30) setErrorMessage('Your search must be between 1 and 30 characters.');
      return;
    }
    const found = searchForCourse(term);
    if (found.length === 0) {
      setErrorMessage('No results found');
      setResults([]);
    } else {
      setErrorMessage('');
      setResults(found);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsSearching(true);
    doSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsSearching(true);
      doSearch(searchTerm);
    }
  };

  // Close results on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSearching(false);
        setResults([]);
        setErrorMessage('');
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold text-[#5e6a71] mb-2">Search</h2>
      <div ref={containerRef} className="relative mb-4">
        <div className="flex">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full text-base focus:outline-none focus:ring-2 focus:ring-[#7a003c] focus:border-transparent"
            placeholder="Search for a course..."
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label="Search for a course"
          />
          <button
            onClick={() => { setIsSearching(true); doSearch(searchTerm); }}
            className="px-4 py-2 bg-[#5e6a71] text-white rounded-r-full hover:bg-[#7a003c] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7a003c]"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {isSearching && (results.length > 0 || errorMessage) && (
          <div className="absolute z-20 w-full bg-white shadow-lg rounded-b-lg p-3 max-h-80 overflow-y-auto border border-t-0 border-gray-200">
            {results.length > 0
              ? results.map((course) => {
                  const isBlocked = antirequisites.blockedCodes.has(course.courseCode);
                  return (
                    <CourseCard
                      key={`search-${course.courseID}`}
                      course={course}
                      onAdd={onAddCourse}
                      disabled={isBlocked}
                      disabledReason={antirequisites.blockedReasons.get(course.courseCode)}
                    />
                  );
                })
              : <p className="text-sm text-gray-500">{errorMessage}</p>
            }
          </div>
        )}
      </div>
    </div>
  );
}
