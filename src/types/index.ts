export interface Course {
  code: string;
  name: string;
  description: string;
  timetable: string;
  id: number;
  source: string;
  term: {
    fall: boolean;
    winter: boolean;
  };
}

export interface CourseListing {
  courseCode: string;
  courseName: string;
  courseDesc: string;
  courseID: number;
  selected?: boolean;
  season?: string;
  key?: number;
}

export interface Requirement {
  count: number;
  from: string[];
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  requirements: Requirement[];
}

export interface ProgramResult {
  programId: string;
  programName: string;
  programSlug: string;
  programPercentage: number;
  programRequirements: { label: string; fulfilled: number; total: number; courses: string[] }[];
  fulfilledCourses: string[][];
}

export interface EligibilityLog {
  numerator: number;
  denominator: number;
  fulfilledCourses: string[];
}

export interface EligibilityResult {
  consumed: {
    numerator: number;
    denominator: number;
    percentage: number;
    fulfilledCourses: string[];
  };
  log: EligibilityLog[];
}

export type Season = 'fall' | 'winter';
