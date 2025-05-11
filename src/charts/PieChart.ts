import { BaseChart } from "./BaseChart";
import { PieChartOptions, LabelValueDataPoint } from "../models/ChartTypes";
import { createGroup, createPath } from "../utils/svg-utils";
import { pointOnCircle } from "../utils/math-utils";

export class PieChart extends BaseChart<PieChartOptions, LabelValueDataPoint> {
  constructor(options: PieChartOptions, data: LabelValueDataPoint[] = []) {
    super(
      {
        showLabels: true,
        showValues: true,
        showLegend: true,
        startAngle: 0,
        endAngle: 360,
        ...options,
      },
      data
    );
  }

  private renderSlice(
    startAngle: number,
    endAngle: number,
    radius: number,
    color: string,
    index: number
  ): string {
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate points on the circle
    const startPoint = pointOnCircle(0, 0, radius, startRad);
    const endPoint = pointOnCircle(0, 0, radius, endRad);

    // Create the path for the pie slice
    const path = `M 0,0 L ${startPoint.x},${startPoint.y} A ${radius},${radius} 0 0,1 ${endPoint.x},${endPoint.y} Z`;

    return createPath(path, {
      fill: color,
      stroke: "white",
      "stroke-width": 1,
    });
  }

  public render(): string {
    if (this.data.length === 0) {
      return this.createSvgContainer() + this.renderEmptyState() + "</svg>";
    }

    const { width, height, x, y } = this.getInnerDimensions();
    const radius = Math.min(width, height) / 2;

    // Calculate total value for percentages
    const total = this.data.reduce((sum, item) => sum + item.value, 0);

    let slices = "";
    let currentAngle = this.options.startAngle || 0;

    // Render each slice
    this.data.forEach((item, index) => {
      const percentage = item.value / total;
      const sliceAngle = percentage * (this.options.endAngle || 360);
      const endAngle = currentAngle + sliceAngle;

      slices += this.renderSlice(
        currentAngle,
        endAngle,
        radius,
        this.getColor(index),
        index
      );

      currentAngle = endAngle;
    });

    // Create the main group and center it
    const group = createGroup(
      {
        transform: `translate(${x + width / 2}, ${y + height / 2})`,
      },
      slices
    );

    return `${this.createSvgContainer()}${this.renderTitle()}${group}</svg>`;
  }
}
