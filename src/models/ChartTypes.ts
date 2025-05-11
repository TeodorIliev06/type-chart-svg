export type BaseDataPoint = XYDataPoint | LabelValueDataPoint;

export interface XYDataPoint {
  x: number;
  y: number;
}

// For pie charts
export interface LabelValueDataPoint {
  label: string;
  value: number;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const DEFAULT_MARGIN: Margin = {
  top: 40,
  right: 30,
  bottom: 50,
  left: 50,
};

export interface ChartOptions {
  width: number;
  height: number;
  margin?: Margin;
  title?: string;
  colors?: string[];
  showLegend?: boolean;
  showAxes?: boolean;
  className?: string;
}

export interface AxialChartOptions extends ChartOptions {
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
  yAxisTicks?: number;
}

export interface LineChartOptions extends AxialChartOptions {
  lineWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  fillArea?: boolean;
}

export interface BarChartOptions extends AxialChartOptions {
  barPadding?: number;
  showValues?: boolean;
}

export interface PieChartOptions extends ChartOptions {
  innerRadius?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  startAngle?: number;
  endAngle?: number;
}

export interface Chart<TOptions = ChartOptions, TData = BaseDataPoint> {
  render(): string;
  updateData(data: TData[]): void;
  updateOptions(options: Partial<TOptions>): void;
}
