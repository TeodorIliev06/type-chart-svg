import { Chart, ChartOptions, DataPoint, DEFAULT_MARGIN, Margin } from '../models/ChartTypes';

export abstract class BaseChart implements Chart {
  protected options: ChartOptions;
  protected defaultColors = [
    "#4285F4", // Blue
    "#EA4335", // Red
    "#FBBC05", // Yellow
    "#34A853", // Green
    "#FF6D01", // Orange
  ];

  constructor(options: ChartOptions) {
    // Set default options if not provided
    this.options = {
      ...options,
      margin: options.margin || { ...DEFAULT_MARGIN },
      colors: options.colors || [...this.defaultColors]
    };
  }

  protected createSvgContainer(): string {
    const { width, height } = this.options;
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  }

  protected renderTitle(): string {
    if (!this.options.title) return '';
    
    const { width, margin = DEFAULT_MARGIN } = this.options;
    const titleX = width / 2;
    const titleY = margin.top / 2;
    
    return `<text x="${titleX}" y="${titleY}" text-anchor="middle" font-weight="bold" font-size="16">${this.options.title}</text>`;
  }

  protected getInnerDimensions(): { width: number; height: number; x: number; y: number } {
    const { width, height, margin = DEFAULT_MARGIN } = this.options;
    
    return {
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
      x: margin.left,
      y: margin.top
    };
  }

  public abstract render(): string;
} 
