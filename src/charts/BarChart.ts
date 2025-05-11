import { AxialChart } from "./AxialChart";
import { BarChartOptions, LabelValueDataPoint } from "../models/ChartTypes";
import {
  createLine,
  createRectangle,
  createText,
  createGroup,
} from "../utils/svg-utils";
import { mapRange, calculateTicks, formatNumber } from "../utils/math-utils";

export class BarChart extends AxialChart<BarChartOptions, LabelValueDataPoint> {
  constructor(options: BarChartOptions, data: LabelValueDataPoint[] = []) {
    super(
      {
        barPadding: 0.2,
        showValues: true,
        ...options,
      },
      data
    );
  }

  private renderAxesAndGrid(): { axes: string; grid: string } {
    const { showAxes, showGrid, xAxisLabel, yAxisLabel } = this.options;
    const { width, height, x, y } = this.getInnerDimensions();

    const values = this.data.map((d) => d.value);
    const { min, max } = this.getDataBounds(values, {
      minZero: true,
      topPadding: 1.1,
    });

    const ticks = calculateTicks(min, max, this.options.yAxisTicks || 5);

    let axes = "";
    let grid = "";

    const topYTick = this.getTopYTick(ticks, min, max, y + height);

    if (showAxes) {
      // X-axis
      axes += createLine(x, y + height, x + width, y + height, {
        stroke: "#333",
        "stroke-width": 1,
      });

      // Y-axis ticks and labels
      ticks.forEach((tick) => {
        const tickY = mapRange(tick, min, max, y + height, y);
        if (tickY >= y && tickY <= y + height) {
          axes += createLine(x - 5, tickY, x, tickY, {
            stroke: "#333",
            "stroke-width": 1,
          });
          axes += createText(x - 10, tickY, formatNumber(tick), {
            "text-anchor": "end",
            "dominant-baseline": "middle",
            "font-size": "12px",
          });
        }
      });

      axes += createLine(x, y + height, x, topYTick, {
        stroke: "#333",
        "stroke-width": 1,
      });

      if (xAxisLabel) {
        axes += createText(x + width / 2, y + height + 40, xAxisLabel, {
          "text-anchor": "middle",
          "font-size": "14px",
        });
      }

      if (yAxisLabel) {
        axes += createText(x - 40, y + height / 2, yAxisLabel, {
          "text-anchor": "middle",
          transform: `rotate(-90 ${x - 40} ${y + height / 2})`,
          "font-size": "14px",
        });
      }
    }

    if (showGrid) {
      ticks.forEach((tick) => {
        const tickY = mapRange(tick, min, max, y + height, y);

        // Only add grid lines within the chart area
        if (tickY >= y && tickY <= y + height) {
          grid += createLine(x, tickY, x + width, tickY, {
            stroke: "#ddd",
            "stroke-width": 1,
            "stroke-dasharray": "4 4",
          });
        }
      });
    }

    return { axes, grid };
  }

  private renderBars(): string {
    const { width, height, x, y } = this.getInnerDimensions();

    // Calculate bar width based on data length and padding
    const barCount = this.data.length;
    const barPadding = this.options.barPadding || 0.2;
    const availableWidth = width / barCount;
    const barWidth = availableWidth * (1 - barPadding);

    const values = this.data.map((d) => d.value);
    const { min, max } = this.getDataBounds(values, {
      minZero: true,
      topPadding: 1.1,
    });

    let barsGroup = "";

    this.data.forEach((dataPoint, i) => {
      const barX = x + i * availableWidth + (availableWidth - barWidth) / 2;

      // For positive values, bars go up from the bottom
      // For negative values, bars go down from the zero line
      let barHeight, barY;

      if (dataPoint.value >= 0) {
        barHeight = mapRange(dataPoint.value, 0, max, 0, height);
        barY = y + height - barHeight;
      } else {
        barHeight = mapRange(
          Math.abs(dataPoint.value),
          0,
          Math.abs(min),
          0,
          height
        );
        barY = y + height;
      }

      barsGroup += createRectangle(barX, barY, barWidth, barHeight, {
        fill: this.getColor(i),
        stroke: "none",
      });
    });

    return createGroup({}, barsGroup);
  }

  private renderLabels(): string {
    const { width, height, x, y } = this.getInnerDimensions();

    const barCount = this.data.length;
    const availableWidth = width / barCount;

    let labelsGroup = "";

    this.data.forEach((dataPoint, i) => {
      const labelX = x + i * availableWidth + availableWidth / 2;
      const labelY = y + height + 20;

      labelsGroup += createText(labelX, labelY, dataPoint.label, {
        "text-anchor": "middle",
        "font-size": "12px",
        // Rotate labels if there are many
        ...(barCount > 10
          ? {
              transform: `rotate(-45 ${labelX} ${labelY})`,
              "text-anchor": "end",
            }
          : {}),
      });
    });

    return createGroup({}, labelsGroup);
  }

  private renderValues(): string {
    const { width, height, x, y } = this.getInnerDimensions();

    const barCount = this.data.length;
    const availableWidth = width / barCount;

    const values = this.data.map((d) => d.value);
    const { min, max } = this.getDataBounds(values, {
      minZero: true,
      topPadding: 1.1,
    });

    let valuesGroup = "";

    this.data.forEach((dataPoint, i) => {
      const labelX = x + i * availableWidth + availableWidth / 2;
      let labelY;

      if (dataPoint.value >= 0) {
        const barHeight = mapRange(dataPoint.value, 0, max, 0, height);
        labelY = y + height - barHeight - 5;
      } else {
        const barHeight = mapRange(
          Math.abs(dataPoint.value),
          0,
          Math.abs(min),
          0,
          height
        );
        labelY = y + height + barHeight + 15;
      }

      valuesGroup += createText(labelX, labelY, formatNumber(dataPoint.value), {
        "text-anchor": "middle",
        "font-size": "12px",
        fill: "#333",
        "font-weight": "bold",
      });
    });

    return createGroup({}, valuesGroup);
  }

  public render(): string {
    if (this.data.length === 0) {
      return this.createSvgContainer() + this.renderEmptyState() + "</svg>";
    }

    const svgOpen = this.createSvgContainer();
    const title = this.renderTitle();
    const { axes, grid } = this.renderAxesAndGrid();
    const bars = this.renderBars();
    const labels = this.renderLabels();
    const values = this.options.showValues ? this.renderValues() : "";

    return `${svgOpen}
      ${title}
      ${grid}
      ${axes}
      ${bars}
      ${labels}
      ${values}
    </svg>`;
  }
}
