import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        barChart: resolve(__dirname, 'examples/bar-chart/bar-chart.html'),
        pieChart: resolve(__dirname, 'examples/pie-chart/pie-chart.html'),
        lineChart: resolve(__dirname, 'examples/line-chart/line-chart.html'),
        chartTemplate: resolve(__dirname, 'examples/chart-template/chart-template.html'),
      }
    }
  }
}); 
