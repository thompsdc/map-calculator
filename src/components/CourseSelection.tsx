import type { CourseListing, Season } from '../types';
import type { AntirequisiteInfo } from '../hooks/useAntirequisites';
import { CourseCard } from './CourseCard';

interface CourseSelectionProps {
  courseList: Record<string, CourseListing[]>;
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
  onAddCourse: (course: CourseListing) => void;
  antirequisites: AntirequisiteInfo;
}

const seasons: { key: Season; label: string }[] = [
  { key: 'fall', label: 'Fall' },
  { key: 'winter', label: 'Winter' },
];

export function CourseSelection({
  courseList,
  selectedSeason,
  onSeasonChange,
  onAddCourse,
  antirequisites,
}: CourseSelectionProps) {
  const currentCourses = courseList[selectedSeason] || [];
  const half = Math.ceil(currentCourses.length / 2);
  const leftCol = currentCourses.slice(0, half);
  const rightCol = currentCourses.slice(half);

  const renderCard = (course: CourseListing) => {
    const isBlocked = antirequisites.blockedCodes.has(course.courseCode);
    return (
      <CourseCard
        key={course.courseID}
        course={course}
        onAdd={onAddCourse}
        disabled={isBlocked}
        disabledReason={antirequisites.blockedReasons.get(course.courseCode)}
      />
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#5e6a71] mb-2">Course Selection</h2>

      {/* Season tabs */}
      <nav className="flex shadow-md mb-0" role="tablist">
        {seasons.map((s) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={selectedSeason === s.key}
            className={`px-6 py-2.5 font-medium text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${
              selectedSeason === s.key
                ? 'bg-white text-[#7a003c] border-t-2 border-x-2 border-[#7a003c] border-b-0'
                : 'bg-[#7a003c] text-white hover:bg-[#ac1455]'
            }`}
            onClick={() => onSeasonChange(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Course list */}
      <div className="bg-white p-4 shadow-lg">
        {currentCourses.length === 0 ? (
          <p className="text-gray-500">There are no courses available for this Term.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-0 md:gap-4">
            <div className="w-full md:w-1/2">
              {leftCol.map(renderCard)}
            </div>
            <div className="w-full md:w-1/2">
              {rightCol.map(renderCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
