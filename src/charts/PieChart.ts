import { BaseChart } from "./BaseChart";
import { PieChartOptions, LabelValueDataPoint } from "../models/ChartTypes";
import { createGroup, createPath, createText } from "../utils/svg-utils";
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
    color: string
  ): string {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const startPoint = pointOnCircle(0, 0, radius, startRad);
    const endPoint = pointOnCircle(0, 0, radius, endRad);

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
    const percentRadius = radius * 0.6;
    const labelRadius = radius * 1.15;
    const leaderRadius = radius * 1.02;

    const total = this.data.reduce((sum, item) => sum + item.value, 0);

    let slices = "";
    let percentTexts = "";
    let labelLines = "";
    let outsideLabels = "";
    let currentAngle = this.options.startAngle || 0;

    this.data.forEach((item, index) => {
      const percentage = item.value / total;
      const percentText = `${Math.round(percentage * 100)}%`;
      const sliceAngle = percentage * (this.options.endAngle || 360);
      const endAngle = currentAngle + sliceAngle;

      slices += this.renderSlice(
        currentAngle,
        endAngle,
        radius,
        this.getColor(index)
      );

      // Draw percentage inside slice
      const midAngle = (currentAngle + endAngle) / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const percentPos = pointOnCircle(0, 0, percentRadius, midRad);
      percentTexts += createText(percentPos.x, percentPos.y, percentText, {
        "text-anchor": "middle",
        "dominant-baseline": "middle",
        "font-size": "14px",
        fill: "#fff",
        "font-weight": "bold",
        "pointer-events": "none"
      });

      // Draw label outside with leader line
      const leaderEnd = pointOnCircle(0, 0, leaderRadius, midRad);
      const labelPos = pointOnCircle(0, 0, labelRadius, midRad);
      labelLines += `<line x1="${leaderEnd.x}" y1="${leaderEnd.y}" x2="${labelPos.x}" y2="${labelPos.y}" stroke="#333" stroke-width="1" />`;
      outsideLabels += createText(labelPos.x, labelPos.y, item.label, {
        "text-anchor": midAngle > 90 && midAngle < 270 ? "end" : "start",
        "dominant-baseline": "middle",
        "font-size": "14px",
        fill: "#333",
        "pointer-events": "none"
      });

      currentAngle = endAngle;
    });

    const group = createGroup(
      {
        transform: `translate(${x + width / 2}, ${y + height / 2})`,
      },
      slices + labelLines + percentTexts + outsideLabels
    );

    return `${this.createSvgContainer()}${this.renderTitle()}${group}</svg>`;
  }
}
