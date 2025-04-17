
'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';

const Chart = dynamic(() => import('recharts').then(mod => mod.PieChart), {
  ssr: false,
});
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), {
  ssr: false,
});
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), {
  ssr: false,
});

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#800080'];

export default function Home() {
  const [data, setData] = useState<string>('');
  const [chartType, setChartType] = useState<string>('pie');
  const [chartData, setChartData] = useState<any[]>([]);

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
        <Chart width={400} height={400}>
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
        </Chart>
      );
    }
    return <div>No chart available for the selected data and chart type.</div>;
  };

  return (
    <div className="flex h-screen w-full">
      {/* Data Input Section */}
      <div className="w-1/2 p-4">
        <Textarea
          placeholder="Paste CSV or JSON data here..."
          className="mb-4 h-[60vh] resize-none"
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
          <label htmlFor="file-upload">
            <Button variant="secondary" asChild>
              <span className="flex items-center"><Upload className="w-4 h-4 mr-2" /> Upload File</span>
            </Button>
          </label>
        </div>

        <Select onValueChange={setChartType} defaultValue={chartType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">Pie Chart</SelectItem>
            {/* Add more chart types here */}
          </SelectContent>
        </Select>
        <Button className="mt-4" onClick={parseData}>Refresh Chart</Button>
      </div>

      {/* Chart Preview Section */}
      <div className="w-1/2 p-4 flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  );
}
