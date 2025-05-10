import { BaseDataPoint, AxialChartOptions } from "../models/ChartTypes";
import { findMinMax } from "../utils/math-utils";
import { BaseChart } from "./BaseChart";

/**
 * Abstract base class for all charts that use X and Y axes
 * (bar charts, line charts, area charts, scatter plots, etc.)
 */
export abstract class AxialChart<
  TOptions extends AxialChartOptions,
  TData extends BaseDataPoint
> extends BaseChart<TOptions, TData> {
  constructor(options: TOptions, data: TData[] = []) {
    super(
      {
        ...options,
        showAxes: options.showAxes !== undefined ? options.showAxes : true,
        showGrid: options.showGrid !== undefined ? options.showGrid : true,
        yAxisTicks: options.yAxisTicks || 5,
      },
      data
    );
  }

  /**
   * Helper to get and adjust data value bounds for axes
   */
  protected getDataBounds(
    values: number[],
    options: {
      adjustMin?: boolean;
      minZero?: boolean;
      topPadding?: number;
    } = {}
  ): { min: number; max: number } {
    const { adjustMin = true, minZero = true, topPadding = 1.1 } = options;

    let { min, max } = findMinMax(values);

    if (adjustMin && minZero) {
      min = min < 0 ? min : 0;
    }

    max = max * topPadding;

    return { min, max };
  }
}
