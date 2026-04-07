export const validExamResultStatuses = ['Pass', 'Failed', 'Unknown'] as const;

export type TakeExamResultStatus = (typeof validExamResultStatuses)[number];

export const isTakeExamResultStatus = (value: string): value is TakeExamResultStatus => {
  return validExamResultStatuses.includes(value as TakeExamResultStatus);
};
