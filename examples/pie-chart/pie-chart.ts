import { PieChart } from '../../src/charts/PieChart';
import { LabelValueDataPoint } from '../../src/models/ChartTypes';
import { saveSvgToFile } from '../../src/utils/svg-utils';

const data: LabelValueDataPoint[] = [
    { label: 'Category A', value: 30 },
    { label: 'Category B', value: 45 },
    { label: 'Category C', value: 28 },
    { label: 'Category D', value: 80 },
    { label: 'Category E', value: 99 }
];

const options = {
    width: 800,
    height: 500,
    margin: { top: 50, right: 50, bottom: 60, left: 60 },
    title: 'Sample Pie Chart',
    showLabels: true,
    showValues: true,
    showLegend: true,
    colors: ['#2196F3', '#4CAF50', '#FFC107', '#F44336', '#9C27B0']
};

const chart = new PieChart(options, data);
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
