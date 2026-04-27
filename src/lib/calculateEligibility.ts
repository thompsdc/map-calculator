import type { Requirement, EligibilityResult } from '../types';

export function calculateEligibility(
  requirements: Requirement[],
  courseSet: Set<string>
): EligibilityResult {
  const consumedRequirementsSet = new Set<string>();
  const loggingRequirements: Set<string>[] = [];

  for (const { count, from } of requirements) {
    const loggingCourseSet = new Set<string>();
    for (const course of from) {
      if (!consumedRequirementsSet.has(course) && courseSet.has(course)) {
        consumedRequirementsSet.add(course);
        loggingCourseSet.add(course);
        if (loggingCourseSet.size === count) break;
      }
    }
    loggingRequirements.push(loggingCourseSet);
  }

  const loggingResults = loggingRequirements.map((cs, index) => ({
    numerator: cs.size,
    denominator: requirements[index].count,
    fulfilledCourses: Array.from(cs),
  }));

  const consumedResults = loggingResults.reduce(
    (acc, req) => {
      acc.numerator += req.numerator;
      acc.denominator += req.denominator;
      return acc;
    },
    { numerator: 0, denominator: 0 }
  );

  const percentage =
    consumedResults.denominator > 0
      ? consumedResults.numerator / consumedResults.denominator
      : 0;

  return {
    consumed: {
      ...consumedResults,
      percentage,
      fulfilledCourses: Array.from(consumedRequirementsSet),
    },
    log: loggingResults,
  };
}
