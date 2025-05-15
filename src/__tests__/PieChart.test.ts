import { PieChart } from "../charts/PieChart";
import { LabelValueDataPoint } from "../models/ChartTypes";
import { parseSvgString } from "../utils/svg-utils";

describe("PieChart", () => {
  const sampleData: LabelValueDataPoint[] = [
    { label: "Category A", value: 30 },
    { label: "Category B", value: 20 },
    { label: "Category C", value: 15 },
    { label: "Category D", value: 35 },
  ];

  const defaultOptions = {
    width: 500,
    height: 300,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
  };

  it("should create a pie chart with default options", () => {
    const chart = new PieChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    expect(svg).toBeDefined();
    expect(svg.tagName).toBe("svg");
    expect(svg.getAttribute("width")).toBe("500");
    expect(svg.getAttribute("height")).toBe("300");
  });

  it("should create a pie chart with custom options", () => {
    const customOptions = {
      ...defaultOptions,
      width: 800,
      height: 400,
      margin: { top: 30, right: 30, bottom: 30, left: 30 },
      showLabels: false,
      showValues: false,
    };

    const chart = new PieChart(customOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    expect(svg.getAttribute("width")).toBe("800");
    expect(svg.getAttribute("height")).toBe("400");
  });

  it("should render pie slices", () => {
    const chart = new PieChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const paths = svg.querySelectorAll("path");
    expect(paths.length).toBe(sampleData.length);
    
    paths.forEach((path) => {
      expect(path.getAttribute("fill")).toBeDefined();
      expect(path.getAttribute("stroke")).toBe("white");
      expect(path.getAttribute("stroke-width")).toBe("1");
    });
  });

  it("should render percentage labels inside slices", () => {
    const chart = new PieChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const percentageTexts = Array.from(svg.querySelectorAll("text")).filter(
      (text) => text.textContent && text.textContent.includes("%")
    );

    expect(percentageTexts.length).toBe(sampleData.length);
    percentageTexts.forEach((text) => {
      expect(text.getAttribute("fill")).toBe("#fff");
      expect(text.getAttribute("font-weight")).toBe("bold");
    });
  });

  it("should render category labels outside the pie", () => {
    const chart = new PieChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    // Find all text elements that don't contain a % sign (these are category labels)
    const categoryLabels = Array.from(svg.querySelectorAll("text")).filter(
      (text) => text.textContent && !text.textContent.includes("%")
    );

    // Filter out any potential title text
    const labels = categoryLabels.filter(
      (text) => !text.parentElement?.classList.contains("chart-title")
    );

    expect(labels.length).toBe(sampleData.length);
    
    const labelTexts = labels.map(label => label.textContent);
    sampleData.forEach(dataPoint => {
      expect(labelTexts).toContain(dataPoint.label);
    });
  });

  it("should render leader lines connecting slices to labels", () => {
    const chart = new PieChart(defaultOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const lines = svg.querySelectorAll("line");
    expect(lines.length).toBe(sampleData.length);
    
    lines.forEach(line => {
      expect(line.getAttribute("stroke")).toBe("#333");
      expect(line.getAttribute("stroke-width")).toBe("1");
    });
  });

  it("should handle empty data", () => {
    const chart = new PieChart(defaultOptions, []);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);
    
    const paths = svg.querySelectorAll("path");
    const texts = svg.querySelectorAll("text");
    
    expect(paths.length).toBe(0);
    
    const emptyStateText = Array.from(texts).find(
      text => text.textContent && text.textContent.toLowerCase().includes("no data")
    );
    expect(emptyStateText).toBeDefined();
  });

  it("should respect custom start and end angles", () => {
    const customOptions = {
      ...defaultOptions,
      startAngle: 90,
      endAngle: 270,
    };
    
    const chart = new PieChart(customOptions, sampleData);
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const paths = svg.querySelectorAll("path");
    expect(paths.length).toBe(sampleData.length);
    
    expect(svg).toBeDefined();
  });

  it("should have showLabels option set to true by default", () => {
    const chart = new PieChart(defaultOptions, sampleData);

    // @ts-ignore - accessing private option for testing
    expect(chart.options.showLabels).toBe(true);
    
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const categoryLabels = Array.from(svg.querySelectorAll("text")).filter(
      (text) => text.textContent && !text.textContent.includes("%")
    );

    const labels = categoryLabels.filter(
      (text) => !text.parentElement?.classList.contains("chart-title")
    );

    expect(labels.length).toBe(sampleData.length);
  });

  it("should have showValues option set to true by default", () => {
    const chart = new PieChart(defaultOptions, sampleData);
    // @ts-ignore - accessing private option for testing
    expect(chart.options.showValues).toBe(true);
    
    const svgString = chart.render();
    const svg = parseSvgString(svgString);

    const percentageTexts = Array.from(svg.querySelectorAll("text")).filter(
      (text) => text.textContent && text.textContent.includes("%")
    );

    expect(percentageTexts.length).toBe(sampleData.length);
  });
});
