import { useState, useCallback, useMemo } from 'react';
import type { CourseListing, ProgramResult } from '../types';
import courses from '../data/courses';
import programs from '../data/programs';
import { calculateEligibility } from '../lib/calculateEligibility';

const MAX_PER_TERM = 5;

export function useCourseStore(initialCourses: Record<string, CourseListing[]>) {
  const [courseList, setCourseList] = useState(initialCourses);
  const [selectedCourses, setSelectedCourses] = useState<CourseListing[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('fall');

  // Count courses per term
  const termCounts = useMemo(() => {
    const counts: Record<string, number> = { fall: 0, winter: 0 };
    for (const c of selectedCourses) {
      const s = c.season;
      if (s && counts[s] !== undefined) {
        counts[s]++;
      }
    }
    return counts;
  }, [selectedCourses]);

  const addCourse = useCallback(
    (course: CourseListing): string | null => {
      if (selectedCourses.some((c) => c.courseID === course.courseID)) {
        return `${course.courseCode} is already in Cart!`;
      }
      if (termCounts[selectedSeason] >= MAX_PER_TERM) {
        return `You can only add ${MAX_PER_TERM} courses per term. Your ${selectedSeason} term is full.`;
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
    [selectedCourses, selectedSeason, termCounts]
  );

  const addSearchedCourse = useCallback(
    (course: CourseListing): string | null => {
      if (selectedCourses.some((c) => c.courseID === course.courseID)) {
        return `${course.courseCode} is already in Cart!`;
      }

      // Determine which term this course belongs to
      const courseData = courses[course.courseID];
      let term = selectedSeason;
      if (courseData) {
        if (courseData.term.fall && !courseData.term.winter) term = 'fall';
        else if (!courseData.term.fall && courseData.term.winter) term = 'winter';
        // If both terms, use the currently selected season
      }

      if (termCounts[term] >= MAX_PER_TERM) {
        return `You can only add ${MAX_PER_TERM} courses per term. Your ${term} term is full.`;
      }

      setSelectedCourses((prev) => [...prev, { ...course, season: term }]);
      return null;
    },
    [selectedCourses, selectedSeason, termCounts]
  );

  const removeCourse = useCallback((courseId: number, season: string) => {
    // Try to unmark the course in the course list (only works if it was added from the list)
    setCourseList((prev) => {
      const updated = { ...prev };
      const seasonList = updated[season] ? [...updated[season]] : [];
      const idx = seasonList.findIndex((c) => c.courseID === courseId);
      if (idx !== -1) {
        seasonList[idx] = { ...seasonList[idx], selected: false };
        updated[season] = seasonList;
        return updated;
      }
      return prev; // no change needed
    });
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
    termCounts,
    maxPerTerm: MAX_PER_TERM,
  };
}
