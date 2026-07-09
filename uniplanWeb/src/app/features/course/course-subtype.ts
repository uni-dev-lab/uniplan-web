export const CourseSubtypeLabels = {
  FullTime: 'редовно',
  PartTime: 'задочно',
} as const;

export type CourseSubtype = typeof CourseSubtypeLabels[keyof typeof CourseSubtypeLabels];