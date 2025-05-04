/**
 * Finds the minimum and maximum values in an array of numbers
 */
export function findMinMax(values: number[]): { min: number; max: number } {
  if (values.length === 0) {
    return { min: 0, max: 0 };
  }
  
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

/**
 * Maps a value from one range to another
 */
export function mapRange(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  if (fromMin === fromMax) {
    return toMin;
  }
  
  const ratio = (value - fromMin) / (fromMax - fromMin);
  return toMin + ratio * (toMax - toMin);
}

