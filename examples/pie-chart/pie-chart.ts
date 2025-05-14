import { PieChart } from '../../src/charts/PieChart';
import { LabelValueDataPoint } from '../../src/models/ChartTypes';

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

saveSvgToFile(chart.render(), 'pie-chart.svg'); 
