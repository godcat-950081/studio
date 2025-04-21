'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<string>('');
  const [chartType, setChartType] = useState<string>('pie');

  const parseData = useCallback(() => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Handle array data
        console.log("Parsed Array Data:", parsed);
      } else if (typeof parsed === 'object') {
        // Handle object data
        console.log("Parsed Object Data:", parsed);
      } else {
        // Handle single value data
        console.log("Parsed Single Value Data:", parsed);
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
        console.log("Parsed CSV Data:", parsedData);
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
        <iframe src="/chart" width="100%" height="600px" />
      </div>
    </div>
  );
}
