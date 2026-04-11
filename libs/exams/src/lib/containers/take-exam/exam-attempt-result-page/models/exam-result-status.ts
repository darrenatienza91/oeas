export const validExamResultStatuses = ['Pass', 'Failed', 'Waiting', 'Unknown'] as const;

export type ExamResultStatus = (typeof validExamResultStatuses)[number];

export const isTakeExamResultStatus = (value: string): value is ExamResultStatus => {
  return validExamResultStatuses.includes(value as ExamResultStatus);
};
