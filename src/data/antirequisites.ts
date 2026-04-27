/**
 * Antirequisite groups: a student may take only ONE course from each group.
 * If a course from a group is added to the cart, the others are blocked.
 */
export const ANTIREQUISITE_GROUPS: string[][] = [
  ['MATH 1A03', 'MATH 1LS3', 'MATH 1X03'],
  ['MATH 1AA3', 'MATH 1LT3', 'MATH 1XX3'],
  ['PHYSICS 1A03', 'PHYSICS 1C03'],
  ['PHYSICS 1AA3', 'PHYSICS 1CC3'],
  ['PSYCH 1X03', 'PSYCH 1F03'],
  ['PSYCH 1XX3', 'PSYCH 1FF3'],
];

/**
 * Lookup: for each course code, which group does it belong to?
 * Pre-computed for O(1) lookup at runtime.
 */
export const ANTIREQUISITE_MAP: Map<string, string[]> = new Map();

for (const group of ANTIREQUISITE_GROUPS) {
  for (const code of group) {
    ANTIREQUISITE_MAP.set(code, group);
  }
}
