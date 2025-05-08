import { Chart, ChartOptions, DEFAULT_MARGIN } from "../models/ChartTypes";

export abstract class BaseChart<TOptions extends ChartOptions, TData>
  implements Chart<TOptions, TData>
{
  protected options: TOptions;
  protected data: TData[];
  protected defaultColors = [
    "#4285F4", // Blue
    "#EA4335", // Red
    "#FBBC05", // Yellow
    "#34A853", // Green
    "#FF6D01", // Orange
  ];

  constructor(options: TOptions, data: TData[] = []) {
    // Set default options if not provided
    this.options = {
      ...options,
      margin: options.margin || { ...DEFAULT_MARGIN },
      colors: options.colors || [...this.defaultColors],
    };
    this.data = data;
  }

  public updateData(data: TData[]): void {
    this.data = data;
  }

  public updateOptions(options: Partial<TOptions>): void {
    this.options = { ...this.options, ...options };
  }

  protected createSvgContainer(): string {
    const { width, height, className } = this.options;
    const classAttr = className ? ` class="${className}"` : "";
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"${classAttr} xmlns="http://www.w3.org/2000/svg">`;
  }

  protected renderTitle(): string {
    if (!this.options.title) return "";

    const { width, margin = DEFAULT_MARGIN } = this.options;
    const titleX = width / 2;
    const titleY = margin.top / 2;

    return `<text x="${titleX}" y="${titleY}" text-anchor="middle" font-weight="bold" font-size="16">${this.options.title}</text>`;
  }

  protected getInnerDimensions(): {
    width: number;
    height: number;
    x: number;
    y: number;
  } {
    const { width, height, margin = DEFAULT_MARGIN } = this.options;

    return {
      width: width - margin.left - margin.right,
      height: height - margin.top - margin.bottom,
      x: margin.left,
      y: margin.top,
    };
  }

  public abstract render(): string;
}
