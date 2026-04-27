import levenshtein from 'fast-levenshtein';
import courses from '../data/courses';
import type { CourseListing } from '../types';

const SEARCH_SCORE_CUT_OFF = 8;
const courseCodes = courses.map((c) => c.code);

export function searchForCourse(searchTerm: string): CourseListing[] {
  const upper = searchTerm.toUpperCase();

  return courseCodes
    .map((code, index) => ({
      id: index,
      code,
      score: levenshtein.get(upper, code),
    }))
    .filter((r) => r.score <= SEARCH_SCORE_CUT_OFF)
    .sort((a, b) => a.score - b.score)
    .map(({ id }) => {
      const { name, code, description, timetable } = courses[id];
      return {
        courseCode: code,
        courseID: id,
        courseName: name,
        courseDesc: description + '\n' + timetable,
      };
    });
}
