import { LineChart } from '../../src/charts/LineChart';
import { DataPoint } from '../../src/models/ChartTypes';

// Sample data
const data: DataPoint[] = [
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 4, y: 8 },
    { x: 5, y: 10 }
];

// Default options
const options = {
    width: 600,
    height: 400,
    margin: { top: 40, right: 20, bottom: 20, left: 20 },
    title: 'Sample Line Chart'
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
