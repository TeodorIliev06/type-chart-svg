import { LineChart } from "../charts/LineChart";
import { XYDataPoint } from "../models/ChartTypes";

// Helper function to parse SVG string into DOM element
function parseSvgString(svgString: string): SVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  return doc.documentElement as unknown as SVGElement;
}

describe("LineChart", () => {
  const sampleData: XYDataPoint[] = [
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 4, y: 8 },
    { x: 5, y: 10 },
  ];

  const defaultOptions = {
    width: 500,
    height: 300,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
  };

  it("should create a line chart with default options", () => {
    const chart = new LineChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    expect(svg).toBeDefined();
    expect(svg.tagName).toBe("svg");
    expect(svg.getAttribute("width")).toBe("500");
    expect(svg.getAttribute("height")).toBe("300");
  });

  it("should create a line chart with custom options", () => {
    const customOptions = {
      ...defaultOptions,
      width: 800,
      height: 400,
      margin: { top: 30, right: 30, bottom: 30, left: 30 },
    };

    const chart = new LineChart(customOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    expect(svg.getAttribute("width")).toBe("800");
    expect(svg.getAttribute("height")).toBe("400");
  });

  it("should render lines between points", () => {
    const chart = new LineChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const dataLines = svg.querySelectorAll("line.data-line");

    expect(dataLines.length).toBe(sampleData.length - 1);
    dataLines.forEach((line) => {
      expect(line.getAttribute("stroke")).toBe("#4285F4");
      expect(line.getAttribute("stroke-width")).toBe("2");
    });
  });

  it("should render data points", () => {
    const chart = new LineChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);
    const circles = svg.querySelectorAll("circle");

    expect(circles.length).toBe(sampleData.length);
    circles.forEach((circle) => {
      expect(circle.getAttribute("r")).toBe("4");
      expect(circle.getAttribute("fill")).toBe("#4285F4");
    });
  });

  it("should handle empty data", () => {
    const chart = new LineChart(defaultOptions, []);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);
    const lines = svg.querySelectorAll("line");
    const circles = svg.querySelectorAll("circle");

    expect(lines.length).toBe(0);
    expect(circles.length).toBe(0);
  });

  it("should render axes", () => {
    const chart = new LineChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const axesLines = Array.from(svg.querySelectorAll("line")).filter(
      (line) =>
        line.getAttribute("stroke") === "#000" &&
        !line.classList.contains("data-line")
    );
    expect(axesLines.length).toBeGreaterThan(0);
  });

  it("should render grid lines", () => {
    const options = { ...defaultOptions, showGrid: true };
    const chart = new LineChart(options, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const gridLines = Array.from(svg.querySelectorAll("line")).filter(
      (line) => line.getAttribute("stroke") === "#ddd"
    );
    expect(gridLines.length).toBeGreaterThan(0);
  });
});
