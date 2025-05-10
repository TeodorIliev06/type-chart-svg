import { AxialChart } from "./AxialChart";
import { XYDataPoint, LineChartOptions } from "../models/ChartTypes";
import {
  createCircle,
  createGroup,
  createLine,
  createText,
} from "../utils/svg-utils";
import { mapRange, calculateTicks, formatNumber } from "../utils/math-utils";

export class LineChart extends AxialChart<LineChartOptions, XYDataPoint> {
  constructor(options: LineChartOptions, data: XYDataPoint[]) {
    super(
      {
        lineWidth: 2,
        showDots: true,
        dotRadius: 4,
        ...options,
      },
      data
    );
  }

  private renderAxes(
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    width: number,
    height: number
  ): string {
    let axesContent = "";

    const margin = this.options.margin || {
      top: 40,
      right: 30,
      bottom: 50,
      left: 50,
    };

    const xTicks = calculateTicks(xMin, xMax, 5);
    const yTicks = calculateTicks(yMin, yMax, this.options.yAxisTicks || 5);

    // Draw X axis
    axesContent += createLine(0, height, width, height, {
      stroke: "#000",
      "stroke-width": 1,
    });

    // Draw Y axis
    axesContent += createLine(0, 0, 0, height, {
      stroke: "#000",
      "stroke-width": 1,
    });

    // Draw X axis ticks and labels
    xTicks.forEach((tick) => {
      const x = mapRange(tick, xMin, xMax, 0, width);
      axesContent += createLine(x, height, x, height + 5, {
        stroke: "#000",
        "stroke-width": 1,
      });
      axesContent += createText(x, height + 20, formatNumber(tick), {
        "text-anchor": "middle",
        "font-size": "12",
      });
    });

    // Draw Y axis ticks and labels
    yTicks.forEach((tick) => {
      const y = mapRange(tick, yMin, yMax, height, 0);
      axesContent += createLine(-5, y, 0, y, {
        stroke: "#000",
        "stroke-width": 1,
      });
      axesContent += createText(-10, y + 4, formatNumber(tick), {
        "text-anchor": "end",
        "font-size": "12",
      });
    });

    // Draw axis labels if provided
    if (this.options.xAxisLabel) {
      axesContent += createText(
        width / 2,
        height + margin.bottom / 1.5,
        this.options.xAxisLabel,
        {
          "text-anchor": "middle",
          "font-size": "14",
        }
      );
    }

    if (this.options.yAxisLabel) {
      axesContent += createText(
        -margin.left / 2,
        height / 2,
        this.options.yAxisLabel,
        {
          "text-anchor": "middle",
          "font-size": "14",
          transform: `rotate(-90 ${-margin.left / 2} ${height / 2})`,
        }
      );
    }

    return axesContent;
  }

  private renderGrid(
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    width: number,
    height: number
  ): string {
    if (!this.options.showGrid) return "";

    let gridContent = "";
    const xTicks = calculateTicks(xMin, xMax, 5);
    const yTicks = calculateTicks(yMin, yMax, this.options.yAxisTicks || 5);

    // Draw vertical grid lines
    xTicks.forEach((tick) => {
      const x = mapRange(tick, xMin, xMax, 0, width);
      gridContent += createLine(x, 0, x, height, {
        stroke: "#ddd",
        "stroke-width": 1,
      });
    });

    // Draw horizontal grid lines
    yTicks.forEach((tick) => {
      const y = mapRange(tick, yMin, yMax, height, 0);
      gridContent += createLine(0, y, width, y, {
        stroke: "#ddd",
        "stroke-width": 1,
      });
    });

    return gridContent;
  }

  public render(): string {
    if (this.data.length === 0) {
      return this.createSvgContainer() + this.renderEmptyState() + "</svg>";
    }

    const { width, height, x, y } = this.getInnerDimensions();

    // Calculate scales
    const xValues = this.data.map((point) => point.x);
    const yValues = this.data.map((point) => point.y);

    const { min: xMin, max: xMax } = this.getDataBounds(xValues, {
      minZero: false,
      adjustMin: false,
      topPadding: 1,
    });

    const { min: yMin, max: yMax } = this.getDataBounds(yValues, {
      minZero: false,
      adjustMin: false,
      topPadding: 1,
    });

    let svg = this.createSvgContainer();
    svg += this.renderTitle();

    let groupContent = "";

    // Add grid lines first (so they appear behind the data)
    if (this.options.showGrid) {
      groupContent += this.renderGrid(xMin, xMax, yMin, yMax, width, height);
    }

    // Draw lines between points
    for (let i = 0; i < this.data.length - 1; i++) {
      const x1 = mapRange(this.data[i].x, xMin, xMax, 0, width);
      const y1 = mapRange(this.data[i].y, yMin, yMax, height, 0);
      const x2 = mapRange(this.data[i + 1].x, xMin, xMax, 0, width);
      const y2 = mapRange(this.data[i + 1].y, yMin, yMax, height, 0);

      groupContent += createLine(x1, y1, x2, y2, {
        stroke: this.getColor(0),
        "stroke-width": this.options.lineWidth || 2,
        class: "data-line",
      });
    }

    if (this.options.showDots) {
      this.data.forEach((point) => {
        const cx = mapRange(point.x, xMin, xMax, 0, width);
        const cy = mapRange(point.y, yMin, yMax, height, 0);

        groupContent += createCircle(cx, cy, this.options.dotRadius || 4, {
          fill: this.getColor(0),
        });
      });
    }

    // Add axes last (so they appear on top)
    groupContent += this.renderAxes(xMin, xMax, yMin, yMax, width, height);

    // Create main chart group with content
    svg += createGroup(
      {
        transform: `translate(${x}, ${y})`,
      },
      groupContent
    );

    svg += "</svg>";

    return svg;
  }
}
