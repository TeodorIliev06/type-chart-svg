import {
  ChartOptions,
  BaseDataPoint,
  Chart,
  DEFAULT_MARGIN,
} from "../models/ChartTypes";
import { createText } from "../utils/svg-utils";

export abstract class BaseChart<
  TOptions extends ChartOptions,
  TData extends BaseDataPoint
> implements Chart<TOptions, TData>
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
    this.options = {
      ...options,
      margin: options.margin || DEFAULT_MARGIN,
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

    return createText(titleX, titleY, this.options.title, {
      "text-anchor": "middle",
      "font-weight": "bold",
      "font-size": "16px",
    });
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

  protected renderEmptyState(message: string = "No data to display"): string {
    const { width, height } = this.options;
    return createText(width / 2, height / 2, message, {
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      "font-size": "16px",
      fill: "#666",
    });
  }

  protected getColor(index: number): string {
    return (
      this.options.colors?.[index % (this.options.colors?.length || 1)] ||
      "#000"
    );
  }

  public abstract render(): string;
}
