import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus, ShoppingCart, Ban } from 'lucide-react';
import type { CourseListing } from '../types';

interface CourseCardProps {
  course: CourseListing;
  onAdd?: (course: CourseListing) => void;
  onRemove?: (courseId: number, season: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function CourseCard({ course, onAdd, onRemove, disabled, disabledReason }: CourseCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border-b border-gray-300 py-2 px-1 relative group ${disabled ? 'opacity-50' : ''}`}
      title={disabled ? disabledReason : undefined}
    >
      <div className="flex items-center justify-between min-h-[32px]">
        <button
          className={`text-left font-medium text-base focus:outline-none focus:underline ${
            disabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'cursor-pointer hover:underline'
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-label={course.courseCode}
          aria-disabled={disabled}
        >
          {course.courseCode}
        </button>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {onAdd && course.selected && !disabled && (
            <span className="text-[#007096]" aria-label={`${course.courseCode} is in your cart`}>
              <ShoppingCart className="w-4 h-4" />
            </span>
          )}
          {disabled && (
            <span className="text-gray-400">
              <Ban className="w-4 h-4" />
            </span>
          )}
          {onAdd && !disabled && (
            <button
              onClick={() => onAdd(course)}
              className="text-[#7a003c] hover:text-[#ac1455] cursor-pointer p-0.5 focus:outline-none focus:ring-1 focus:ring-[#7a003c] rounded"
              aria-label={`Add ${course.courseCode} to cart`}
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(course.courseID, course.season || '')}
              className="text-[#7a003c] hover:text-red-600 cursor-pointer p-0.5 focus:outline-none focus:ring-1 focus:ring-[#7a003c] rounded"
              aria-label={`Remove ${course.courseCode} from cart`}
            >
              <Minus className="w-5 h-5" />
            </button>
          )}
          {!disabled && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#7a003c] cursor-pointer p-0.5 focus:outline-none focus:ring-1 focus:ring-[#7a003c] rounded"
              aria-label={isOpen ? `Collapse ${course.courseCode} info` : `Expand ${course.courseCode} info`}
            >
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Tooltip on hover for disabled courses */}
      {disabled && disabledReason && (
        <div className="absolute left-0 right-0 bottom-full mb-1 z-30 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {disabledReason}
        </div>
      )}

      {isOpen && !disabled && (
        <div className="mt-2 p-3 bg-[#efefef] rounded text-sm leading-relaxed">
          <strong>{course.courseName}</strong>{' '}
          {course.courseDesc}
        </div>
      )}
    </div>
  );
}
