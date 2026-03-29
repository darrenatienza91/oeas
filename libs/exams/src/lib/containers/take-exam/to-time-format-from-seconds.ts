export const toTimeFormatFromSeconds = (
  value: number | null | undefined,
  showHours: boolean = true,
): string => {
  if (value == null || isNaN(value)) {
    return '00:00';
  }

  const totalSeconds = Math.floor(value);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  if (showHours) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
};
