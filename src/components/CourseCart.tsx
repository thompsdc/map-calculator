import { useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import type { CourseListing } from '../types';
import { CourseCard } from './CourseCard';

interface CourseCartProps {
  selectedCourses: CourseListing[];
  onRemoveCourse: (courseId: number, season: string) => void;
  onSubmit: () => void;
  termCounts: Record<string, number>;
  maxPerTerm: number;
}

export function CourseCart({ selectedCourses, onRemoveCourse, onSubmit, termCounts, maxPerTerm }: CourseCartProps) {
  const cartRef = useRef<HTMLHeadingElement>(null);
  const isValid = selectedCourses.length > 0;

  const handleSubmit = () => {
    if (isValid) {
      onSubmit();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <h2 ref={cartRef} className="text-xl font-bold text-[#5e6a71]">
          Cart
        </h2>
        <button
          onClick={() => cartRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center justify-center w-14 h-14 bg-[#7a003c] text-white rounded-full shadow-lg cursor-pointer hover:bg-[#ac1455] transition-colors md:static fixed bottom-4 right-4 z-30 md:z-auto"
          aria-label={`There are ${selectedCourses.length} courses in your cart`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-xs font-bold ml-0.5">{selectedCourses.length}</span>
        </button>
      </div>

      <div className="bg-[#efefef] border-t-[6px] border-[#fdbf57] shadow-lg min-h-[36vh] relative flex flex-col">
        <div className="flex gap-3 px-3 pt-2 text-xs font-medium text-[#5e6a71]">
          <span className={termCounts.fall >= maxPerTerm ? 'text-red-600' : ''}>
            Fall: {termCounts.fall}/{maxPerTerm}
          </span>
          <span className={termCounts.winter >= maxPerTerm ? 'text-red-600' : ''}>
            Winter: {termCounts.winter}/{maxPerTerm}
          </span>
        </div>
        <div className="p-2 flex-1 overflow-y-auto pb-16">
          {selectedCourses.length > 0 ? (
            selectedCourses.map((course) => (
              <CourseCard key={course.courseID} course={course} onRemove={onRemoveCourse} />
            ))
          ) : (
            <p className="text-sm text-gray-500 p-2">
              Add a course from Course Selection for it to appear here.
            </p>
          )}
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <button
            onClick={handleSubmit}
            disabled={selectedCourses.length === 0}
            className="px-8 py-2 bg-[#7a003c] text-white rounded font-medium hover:bg-[#5e6a71] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7a003c] focus:ring-offset-2"
            aria-label="View program results based on courses added to your cart"
          >
            Submit
          </button>
        </div>
      </div>

      {selectedCourses.length > 0 && !isValid && (
        <p className="text-red-600 text-sm mt-2" role="alert">
          You must add at least 1 course to your cart.
        </p>
      )}
    </div>
  );
}
