import { BarChart } from '../../src/charts/BarChart';
import { LabelValueDataPoint } from '../../src/models/ChartTypes';

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

// Function to save SVG to file
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

// Save the chart
saveSvgToFile(chart.render(), 'bar-chart.svg'); 
