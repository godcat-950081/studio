
'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), {
  ssr: false,
});
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), {
  ssr: false,
});
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), {
  ssr: false,
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#800080'];

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

export default function Home() {
  const [data, setData] = useState<string>('');
  const [chartType, setChartType] = useState<string>('pie');
  const [chartData, setChartData] = useState<any[]>([]);
  const chartRef = useRef<ReactECharts | null>(null);

  const parseData = useCallback(() => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        setChartData(parsed);
      } else if (typeof parsed === 'object') {
        // Transform object to array of key-value pairs
        const arrayData = Object.entries(parsed).map(([name, value]) => ({ name, value: Number(value) }));
        setChartData(arrayData);
      } else {
        setChartData([{ name: 'Data', value: Number(parsed) }]);
      }
    } catch (e) {
      try {
        // CSV parsing
        const lines = data.split('\n');
        const headers = lines[0].split(',');
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index] ? values[index].trim() : '';
            return obj;
          }, {});
        });
        setChartData(parsedData);
      } catch (csvError) {
        alert('Error parsing data. Please ensure it is valid JSON or CSV.');
        console.error('Parsing error:', csvError);
      }
    }
  }, [data]);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      setData(text as string);
    };
    reader.readAsText(file);
  };

  const renderChart = () => {
    if (chartType === 'pie' && chartData.length > 0) {
      return (
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={160}
            fill="#8884d8"
            label
          >
            {
              chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            }
          </Pie>
        </PieChart>
      );
    }
    return <div>No chart available for the selected data and chart type.</div>;
  };

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
    <div className="flex h-screen w-full">
      {/* Data Input Section */}
      <div className="w-1/4 p-4">
        <Textarea
          placeholder="Paste CSV or JSON data here..."
          className="mb-4 h-[60vh] resize-none w-full"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="w-full">
            <Button variant="secondary" asChild className="w-full">
              <span className="flex items-center justify-center"><Upload className="w-4 h-4 mr-2" /> Upload File</span>
            </Button>
          </label>
        </div>

        <Select onValueChange={setChartType} defaultValue={chartType} className="w-full">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">Pie Chart</SelectItem>
            {/* Add more chart types here */}
          </SelectContent>
        </Select>
        <div className="flex justify-center mt-4">
          <Button className="w-1/2" onClick={parseData}>Generate</Button>
        </div>
      </div>

      {/* Chart Preview Section */}
      <div className="w-3/4 p-4 flex flex-col items-center justify-start">
        {renderChart()}
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
    </div>
  );
}
