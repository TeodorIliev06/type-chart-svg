import { LineChart } from '../../src/charts/LineChart';
import { XYDataPoint } from '../../src/models/ChartTypes';

// Sample data
const data: XYDataPoint[] = [
    { x: 0, y: 0 },
    { x: 1, y: 2.5 },
    { x: 2, y: 4.2 },
    { x: 3, y: 3.8 },
    { x: 4, y: 6.1 },
    { x: 5, y: 5.9 },
    { x: 6, y: 8.3 },
    { x: 7, y: 7.5 },
    { x: 8, y: 9.2 },
    { x: 9, y: 10.1 }
];

// Default options
const options = {
    width: 800,
    height: 500,
    margin: { top: 50, right: 50, bottom: 60, left: 60 },
    title: 'Sample Line Chart',
    xAxisLabel: 'Time (hours)',
    yAxisLabel: 'Value',
    showGrid: true,
    yAxisTicks: 6,
    lineWidth: 2.5,
    showDots: true,
    dotRadius: 4,
    colors: ['#2196F3']
};

// Create chart with default options
const chart = new LineChart(options, data);
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
saveSvgToFile(chart.render(), 'line-chart.svg'); 
