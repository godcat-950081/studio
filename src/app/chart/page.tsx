'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Button } from "@/components/ui/button";



interface SeriesConfig {
  type: string;
  [key: string]: any;
};
interface ChartConfig extends echarts.EChartsOption {
  series: SeriesConfig[];
};

const fetchChartConfig = async (): Promise<ChartConfig> => {
    try {
      const response = await fetch('chart/chartConfig.json');
      console.log(response.status)
      if (!response.ok) {
        throw new Error('Failed to fetch chart configuration from /app/chart/chartConfig.json');
      }
      return response.json();
    } catch (error) {
        console.error('fetchChartConfig error:', error);
        throw error;
      }
};
export default function ChartPage() {
  const chartRef = useRef<ReactECharts | null>(null);
  const [chartOption, setChartOption] = useState<any>(null);

  useEffect(() => {
    fetchChartConfig().then(config => {
        const options = generateChartOptions(config)
        setChartOption(options)
    }).catch(error => {
        console.error('Error fetching chart configuration:', error);
    });
  }, [])

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

  const generateChartOptions = (config: ChartConfig): echarts.EChartsOption => {
    
    return {
      ...config,
      
    };
  }

  
  return (
    <div className="flex flex-col items-center justify-start">
      {chartOption && <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ height: '500px', width: '100%' }}
      />}
      <Button onClick={handleDownload}>
        Export as PNG
      </Button>
    </div>
  );
}
