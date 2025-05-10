import { BarChart } from "../charts/BarChart";
import { LabelValueDataPoint } from "../models/ChartTypes";
import { parseSvgString } from "../utils/svg-utils";

describe("BarChart", () => {
  const sampleData: LabelValueDataPoint[] = [
    { label: "A", value: 10 },
    { label: "B", value: 20 },
    { label: "C", value: 15 },
  ];

  const defaultOptions = {
    width: 400,
    height: 300,
    margin: { top: 20, right: 20, bottom: 40, left: 40 },
    showGrid: true,
    showValues: true,
    colors: ["#4285F4"],
  };

  it("should create a bar chart SVG with correct dimensions", () => {
    const chart = new BarChart(defaultOptions, sampleData);
    const svg = parseSvgString(chart.render());
    expect(svg.getAttribute("width")).toBe("400");
    expect(svg.getAttribute("height")).toBe("300");
  });

  it("should render the correct number of bars", () => {
    const chart = new BarChart(defaultOptions, sampleData);
    const svg = parseSvgString(chart.render());
    const rects = svg.querySelectorAll("rect");
    expect(rects.length).toBe(sampleData.length);
  });

  it("should render axes lines", () => {
    const chart = new BarChart(defaultOptions, sampleData);
    const svg = parseSvgString(chart.render());
    const axesLines = Array.from(svg.querySelectorAll("line")).filter(
      (line) => line.getAttribute("stroke") === "#333"
    );
    expect(axesLines.length).toBeGreaterThan(0);
  });

  it("should render grid lines", () => {
    const chart = new BarChart(defaultOptions, sampleData);
    const svg = parseSvgString(chart.render());
    const gridLines = Array.from(svg.querySelectorAll("line")).filter(
      (line) => line.getAttribute("stroke") === "#ddd"
    );
    expect(gridLines.length).toBeGreaterThan(0);
  });

  it("should render value labels above bars", () => {
    const chart = new BarChart(defaultOptions, sampleData);
    const svg = parseSvgString(chart.render());
    const texts = Array.from(svg.querySelectorAll("text"));
    // Should contain at least one value label
    expect(texts.some(t => t.textContent === "10")).toBe(true);
    expect(texts.some(t => t.textContent === "20")).toBe(true);
    expect(texts.some(t => t.textContent === "15")).toBe(true);
  });

  it("should render empty state for no data", () => {
    const chart = new BarChart(defaultOptions, []);
    const svg = parseSvgString(chart.render());
    expect(svg.textContent).toContain("No data to display");
  });
});
