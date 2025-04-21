'use client';

import React, { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Button } from "@/components/ui/button";

const initialData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 200 },
  { name: 'Category D', value: 100 },
];

const initialBarChartOption: echarts.EChartsOption = {
  xAxis: {
    type: 'category',
    data: initialData.map(item => item.name),
    axisLabel: {
      color: '#9ca3af' // Muted foreground color
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#9ca3af' // Muted foreground color
    },
  },
  series: [
    {
      data: initialData.map(item => item.value),
      type: 'bar',
      itemStyle: {
        color: '#008080' // Accent color
      }
    }
  ],
  backgroundColor: 'transparent', // Make background transparent
  textStyle: {
    color: '#9ca3af' // Muted foreground color for all text
  },
};

export default function ChartPage() {
  const chartRef = useRef<ReactECharts | null>(null);

  const handleDownload = () => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance();
      const dataURL = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#141a1f'
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'bar_chart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start">
      {/* eCharts Bar Chart */}
      <ReactECharts
        ref={chartRef}
        option={initialBarChartOption}
        style={{ height: '500px', width: '100%' }}
      />
      <Button onClick={handleDownload}>
        Export as PNG
      </Button>
    </div>
  );
}
