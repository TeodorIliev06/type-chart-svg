// Chart Template for TypeScript SVG Chart Gallery
// ------------------------------------------------
// 1. Change chart type (PieChart, BarChart, etc.)
// 2. Edit data and options below
// 3. Open chart-template.html in your browser

import { PieChart } from '../../src/charts/PieChart';
import { LabelValueDataPoint } from '../../src/models/ChartTypes';

// Sample data (edit as you like)
const data: LabelValueDataPoint[] = [
  { label: 'Alpha', value: 25 },
  { label: 'Beta', value: 40 },
  { label: 'Gamma', value: 35 },
];

// Chart options (customize these)
const options = {
  width: 700,
  height: 400,
  margin: { top: 40, right: 40, bottom: 40, left: 40 },
  title: 'Custom Pie Chart',
  showLegend: true,
};

// Create and render the chart
const chart = new PieChart(options, data);
const chartContainer = document.getElementById('chart');
if (chartContainer) {
  chartContainer.innerHTML = chart.render();
}

// Download SVG functionality
function saveSvgToFile(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const downloadBtn = document.getElementById('download-btn');
if (downloadBtn && chartContainer) {
  downloadBtn.addEventListener('click', () => {
    const svg = chart.render();
    saveSvgToFile(svg, 'my-chart.svg');
  });
} 
