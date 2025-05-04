export interface DataPoint {
  x: number;
  y: number;
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
  left: 50
};

export interface ChartOptions {
  width: number;
  height: number;
  margin?: Margin;
  title?: string;
  colors?: string[];
}

export interface AxialChartOptions extends ChartOptions {
  xAxisLabel?: string;
  yAxisLabel?: string;
  showGrid?: boolean;
}

export interface LineChartOptions extends AxialChartOptions {
  lineWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  fillArea?: boolean;
}

export interface Chart {
  render(): string;
} 
