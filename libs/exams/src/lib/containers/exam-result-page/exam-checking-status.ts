export const validExamCheckingStatuses = [
  'NotYetChecked',
  'PartiallyChecked',
  'Done',
  'Unknown',
] as const;

export type TakeExamCheckingStatus = (typeof validExamCheckingStatuses)[number];

export const isTakeExamCheckingStatus = (value: string): value is TakeExamCheckingStatus => {
  return validExamCheckingStatuses.includes(value as TakeExamCheckingStatus);
};
