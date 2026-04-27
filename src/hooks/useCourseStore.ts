import { useState, useCallback } from 'react';
import type { CourseListing, ProgramResult } from '../types';
import courses from '../data/courses';
import programs from '../data/programs';
import { calculateEligibility } from '../lib/calculateEligibility';

export function useCourseStore(initialCourses: Record<string, CourseListing[]>) {
  const [courseList, setCourseList] = useState(initialCourses);
  const [selectedCourses, setSelectedCourses] = useState<CourseListing[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('fall');

  const addCourse = useCallback(
    (course: CourseListing): string | null => {
      if (selectedCourses.some((c) => c.courseID === course.courseID)) {
        return `${course.courseCode} is already in Cart!`;
      }

      setCourseList((prev) => {
        const updated = { ...prev };
        const seasonList = [...(updated[selectedSeason] || [])];
        const idx = seasonList.findIndex((c) => c.courseID === course.courseID);
        if (idx !== -1) {
          seasonList[idx] = { ...seasonList[idx], selected: true, season: selectedSeason };
        }
        updated[selectedSeason] = seasonList;
        return updated;
      });

      setSelectedCourses((prev) => [...prev, { ...course, season: selectedSeason }]);
      return null;
    },
    [selectedCourses, selectedSeason]
  );

  const addSearchedCourse = useCallback(
    (course: CourseListing): string | null => {
      if (selectedCourses.some((c) => c.courseID === course.courseID)) {
        return `${course.courseCode} is already in Cart!`;
      }
      setSelectedCourses((prev) => [...prev, { ...course, season: 'searched' }]);
      return null;
    },
    [selectedCourses]
  );

  const removeCourse = useCallback((courseId: number, season: string) => {
    if (season !== 'searched') {
      setCourseList((prev) => {
        const updated = { ...prev };
        const seasonList = [...(updated[season] || [])];
        const idx = seasonList.findIndex((c) => c.courseID === courseId);
        if (idx !== -1) {
          seasonList[idx] = { ...seasonList[idx], selected: false };
        }
        updated[season] = seasonList;
        return updated;
      });
    }
    setSelectedCourses((prev) => prev.filter((c) => c.courseID !== courseId));
  }, []);

  const submitCourses = useCallback((): ProgramResult[] => {
    const courseIdList = selectedCourses.map((c) => c.courseID);
    const courseSet = new Set(courseIdList.map((id) => courses[id].code));

    return programs
      .map(({ id, name, requirements, slug }) => {
        const results = calculateEligibility(requirements, courseSet);
        const fulfilledCourses = results.log.map((r) => r.fulfilledCourses);

        return {
          fulfilledCourses,
          programId: id,
          programName: name,
          programPercentage: results.consumed.percentage,
          programRequirements: requirements.map(({ count, from }, index) => ({
            label: from.join(', '),
            fulfilled: results.log[index].numerator,
            total: count,
            courses: results.log[index].fulfilledCourses,
          })),
          programSlug: slug,
        };
      })
      .sort((a, b) => b.programPercentage - a.programPercentage);
  }, [selectedCourses]);

  return {
    courseList,
    selectedCourses,
    selectedSeason,
    setSelectedSeason,
    addCourse,
    addSearchedCourse,
    removeCourse,
    submitCourses,
  };
}
