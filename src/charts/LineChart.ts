import { BaseChart } from "./BaseChart";
import { DataPoint, LineChartOptions } from "../models/ChartTypes";
import { createCircle, createGroup, createLine, createPath, createText } from "../utils/svg-utils";
import { findMinMax, mapRange } from "../utils/math-utils";

export class LineChart extends BaseChart {
    private data: DataPoint[];
    protected options: LineChartOptions;
  
    constructor(options: LineChartOptions, data: DataPoint[]) {
      super(options);
      this.data = data;
      this.options = {
        lineWidth: 2,
        showDots: true,
        dotRadius: 4,
        ...options
      };
    }
  
    public render(): string {
      if (this.data.length === 0) {
        return this.createSvgContainer() + '</svg>';
      }
  
      const { width, height, x, y } = this.getInnerDimensions();
      
      // Calculate scales
      const xValues = this.data.map(point => point.x);
      const yValues = this.data.map(point => point.y);
      const { min: xMin, max: xMax } = findMinMax(xValues);
      const { min: yMin, max: yMax } = findMinMax(yValues);
  
      let svg = this.createSvgContainer();
      svg += this.renderTitle();
  
      let groupContent = '';
  
      // Draw lines between points
      for (let i = 0; i < this.data.length - 1; i++) {
        const x1 = mapRange(this.data[i].x, xMin, xMax, 0, width);
        const y1 = mapRange(this.data[i].y, yMin, yMax, height, 0);
        const x2 = mapRange(this.data[i + 1].x, xMin, xMax, 0, width);
        const y2 = mapRange(this.data[i + 1].y, yMin, yMax, height, 0);
  
        groupContent += createLine(x1, y1, x2, y2, {
          stroke: this.options.colors?.[0] || '#000',
          'stroke-width': this.options.lineWidth || 2
        });
      }

      if (this.options.showDots) {
        this.data.forEach(point => {
          const cx = mapRange(point.x, xMin, xMax, 0, width);
          const cy = mapRange(point.y, yMin, yMax, height, 0);
          
          groupContent += createCircle(cx, cy, this.options.dotRadius || 4, {
            fill: this.options.colors?.[0] || '#000'
          });
        });
      }
  
      // Create main chart group with content
      svg += createGroup({
        transform: `translate(${x}, ${y})`
      }, groupContent);
  
      svg += '</svg>';
  
      return svg;
    }
  }
