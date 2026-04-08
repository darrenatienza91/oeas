export const validExamCheckingStatuses = [
  'NotYetChecked',
  'PartiallyChecked',
  'Done',
  'Unknown',
] as const;

export type ExamCheckingStatus = (typeof validExamCheckingStatuses)[number];

export const isTakeExamCheckingStatus = (value: string): value is ExamCheckingStatus => {
  return validExamCheckingStatuses.includes(value as ExamCheckingStatus);
};
