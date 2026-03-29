export const toSeconds = (value: number, unit: 'ms' | 'min' | 'hr' = 'ms'): number => {
  if (value == null) return 0;

  switch (unit) {
    case 'ms':
      return Math.floor(value / 1000);
    case 'min':
      return value * 60;
    case 'hr':
      return value * 3600;
    default:
      return value;
  }
};
