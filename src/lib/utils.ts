import type { CourseListing } from '../types';

/**
 * Flattens the grouped-by-department course listings into a single array per term.
 * Mirrors the old getTermCourseList function.
 */
export function getTermCourseList(
  termCoursesByDept: Record<string, CourseListing[]> | undefined
): CourseListing[] {
  if (!termCoursesByDept) return [];
  const all: CourseListing[] = [];
  for (const dept in termCoursesByDept) {
    for (const course of termCoursesByDept[dept]) {
      all.push({ ...course, key: course.courseID });
    }
  }
  return all;
}
