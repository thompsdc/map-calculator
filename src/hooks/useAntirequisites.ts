import { useMemo } from 'react';
import type { CourseListing } from '../types';
import courses from '../data/courses';
import { ANTIREQUISITE_MAP } from '../data/antirequisites';

export interface AntirequisiteInfo {
  /** Set of course codes that are currently blocked */
  blockedCodes: Set<string>;
  /** Map from blocked course code → tooltip explanation string */
  blockedReasons: Map<string, string>;
}

/**
 * Given the list of courses currently in the cart, determines which
 * course codes should be blocked due to antirequisite rules.
 */
export function useAntirequisites(selectedCourses: CourseListing[]): AntirequisiteInfo {
  return useMemo(() => {
    const blockedCodes = new Set<string>();
    const blockedReasons = new Map<string, string>();

    // Get the course codes currently in the cart
    const selectedCodes = new Set(
      selectedCourses.map((c) => courses[c.courseID]?.code).filter(Boolean)
    );

    for (const selectedCode of selectedCodes) {
      const group = ANTIREQUISITE_MAP.get(selectedCode);
      if (!group) continue;

      // Block every other course in the group
      for (const code of group) {
        if (code !== selectedCode && !selectedCodes.has(code)) {
          blockedCodes.add(code);
          const groupLabel = group.join(', ');
          blockedReasons.set(
            code,
            `You may choose only one from: ${groupLabel}. You already have ${selectedCode} in your cart.`
          );
        }
      }
    }

    return { blockedCodes, blockedReasons };
  }, [selectedCourses]);
}
