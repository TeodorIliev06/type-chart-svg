import { BarChart } from '../../src/charts/BarChart';
import { LabelValueDataPoint } from '../../src/models/ChartTypes';
import { saveSvgToFile } from '../../src/utils/svg-utils';

// Sample data
const data: LabelValueDataPoint[] = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 28 },
    { label: 'Apr', value: 80 },
    { label: 'May', value: 99 },
    { label: 'Jun', value: 43 }
];

// Default options
const options = {
    width: 800,
    height: 500,
    margin: { top: 50, right: 50, bottom: 60, left: 60 },
    title: 'Sample Bar Chart',
    xAxisLabel: 'Month',
    yAxisLabel: 'Value',
    showGrid: true,
    yAxisTicks: 6,
    barPadding: 0.2,
    showValues: true,
    colors: ['#2196F3']
};

// Create chart with default options
const chart = new BarChart(options, data);
const chartContainer = document.getElementById('chart');
if (chartContainer) {
    chartContainer.innerHTML = chart.render();
}

const downloadBtn = document.getElementById('download-btn');
if (downloadBtn && chartContainer) {
  downloadBtn.addEventListener('click', () => {
    const svg = chart.render();
    saveSvgToFile(svg, 'my-chart.svg');
  });
}
