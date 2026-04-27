import { useState, useMemo, useCallback } from 'react';
import courseListings from './data/courseListings';
import { getTermCourseList } from './lib/utils';
import { useCourseStore } from './hooks/useCourseStore';
import { useAntirequisites } from './hooks/useAntirequisites';
import { SearchBar } from './components/SearchBar';
import { CourseSelection } from './components/CourseSelection';
import { CourseCart } from './components/CourseCart';
import { ProgramResults } from './components/ProgramResults';
import { ErrorMessage } from './components/ErrorMessage';
import type { ProgramResult } from './types';

function App() {
  // Flatten course listings by term (same as old getTermCourseList)
  const allCourses = useMemo(
    () => ({
      fall: getTermCourseList(courseListings.courseLists.Fall),
      winter: getTermCourseList(courseListings.courseLists.Winter),
    }),
    []
  );

  const store = useCourseStore(allCourses);
  const antirequisites = useAntirequisites(store.selectedCourses);
  const [error, setError] = useState<{ message: string; timeout?: number; key: number } | null>(null);
  const [programResults, setProgramResults] = useState<ProgramResult[] | null>(null);

  const showError = useCallback((msg: string, timeout = 5000) => {
    setError({ message: msg, timeout, key: Date.now() });
  }, []);

  const handleAddCourse = useCallback(
    (course: Parameters<typeof store.addCourse>[0]) => {
      const err = store.addCourse(course);
      if (err) showError(err);
    },
    [store.addCourse, showError]
  );

  const handleAddSearched = useCallback(
    (course: Parameters<typeof store.addSearchedCourse>[0]) => {
      const err = store.addSearchedCourse(course);
      if (err) showError(err);
    },
    [store.addSearchedCourse, showError]
  );

  const handleSubmit = useCallback(() => {
    const results = store.submitCourses();
    setProgramResults(results);
  }, [store.submitCourses]);

  return (
    <div className="min-h-screen bg-white font-[Roboto,sans-serif]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10">
        {error && (
          <ErrorMessage
            key={error.key}
            message={error.message}
            timeout={error.timeout}
          />
        )}

        {/* Search */}
        <div className="mb-6 max-w-4xl">
          <SearchBar onAddCourse={handleAddSearched} antirequisites={antirequisites} />
        </div>

        {/* Main layout: Course Selection + Cart */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-3/4">
            <CourseSelection
              courseList={store.courseList}
              selectedSeason={store.selectedSeason}
              onSeasonChange={store.setSelectedSeason}
              onAddCourse={handleAddCourse}
              antirequisites={antirequisites}
            />
          </div>

          <div className="w-full md:w-1/4">
            <CourseCart
              selectedCourses={store.selectedCourses}
              onRemoveCourse={store.removeCourse}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* Results modal */}
        {programResults && (
          <ProgramResults
            results={programResults}
            onClose={() => setProgramResults(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
