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
 * Calculates round values for axis ticks
 */
export function calculateTicks(
  min: number,
  max: number,
  targetTickCount: number
): number[] {
  if (min === max) {
    return [min];
  }
  
  const range = max - min;
  const rawStep = range / (targetTickCount - 1);
  
  // Round to a nice step size
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalizedStep = rawStep / magnitude;
  
  let niceStep;
  if (normalizedStep < 1.5) {
    niceStep = 1;
  } else if (normalizedStep < 3) {
    niceStep = 2;
  } else if (normalizedStep < 7) {
    niceStep = 5;
  } else {
    niceStep = 10;
  }
  niceStep *= magnitude;
  
  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  
  const ticks = [];
  for (let tick = niceMin; tick <= niceMax + 0.5 * niceStep; tick += niceStep) {
    // Add a small epsilon and round to avoid floating point errors
    ticks.push(Math.round((tick + Number.EPSILON) * 1000) / 1000);
  }
  
  return ticks;
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

/**
 * Formats a number for display on charts
 */
export function formatNumber(num: number): string {
  // For small numbers, show as is with up to 2 decimal places
  if (Math.abs(num) < 1000) {
    return num.toFixed(Math.abs(num) < 10 ? 1 : 0);
  }
  
  if (Math.abs(num) < 1000000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  
  if (Math.abs(num) < 1000000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  
  return (num / 1000000000).toFixed(1) + 'B';
}

/**
 * Calculates the coordinates of a point on a circle
 */
export function pointOnCircle(
  centerX: number,
  centerY: number,
  radius: number,
  angleInRadians: number
): { x: number; y: number } {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
} 
