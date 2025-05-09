import { BaseChart } from "./BaseChart";
import { BarChartOptions, LabelValueDataPoint } from "../models/ChartTypes";
import {
  createLine,
  createRectangle,
  createText,
  createGroup,
} from "../utils/svg-utils";
import {
  findMinMax,
  mapRange,
  calculateTicks,
  formatNumber,
} from "../utils/math-utils";

export class BarChart extends BaseChart<BarChartOptions, LabelValueDataPoint> {
  constructor(options: BarChartOptions, data: LabelValueDataPoint[] = []) {
    super(
      {
        barPadding: 0.2,
        showValues: true,
        yAxisTicks: 5,
        ...options,
      },
      data
    );
  }

  private renderEmptyState(): string {
    const { width, height } = this.options;

    return createText(width / 2, height / 2, "No data to display", {
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      "font-size": "16px",
      fill: "#666",
    });
  }


  private renderLabels(): string {
    const { width, height, x, y } = this.getInnerDimensions();

    // Calculate label positioning
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

  public render(): string {
    if (this.data.length === 0) {
      return this.createSvgContainer() + this.renderEmptyState() + "</svg>";
    }

    const svgOpen = this.createSvgContainer();
    const title = this.renderTitle();
    const labels = this.renderLabels();

    return `${svgOpen}
      ${title}
      ${grid}
      ${axes}
      ${labels}
    </svg>`;
  }
}
