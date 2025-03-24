
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';
import { FileComparisonResult } from '../utils/similarityChecker';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface ResultsChartProps {
  results: FileComparisonResult[];
}

type ChartType = 'bar' | 'pie';

const ResultsChart: React.FC<ResultsChartProps> = ({ results }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  
  if (results.length === 0) {
    return null;
  }
  
  // Prepare chart data
  const chartData = results
    .slice(0, 10) // Take top 10 results for readability
    .map(result => ({
      id: result.id,
      name: `${result.fileA.name.substring(0, 10)}... & ${result.fileB.name.substring(0, 10)}...`,
      value: Math.round(result.similarityScore * 100),
      fileA: result.fileA.name,
      fileB: result.fileB.name,
    }));
  
  // Classification data for pie chart
  const createPieData = () => {
    const classifications = [
      { name: 'High Similarity (70-100%)', value: 0, color: '#ef4444' },
      { name: 'Medium Similarity (40-69%)', value: 0, color: '#f59e0b' },
      { name: 'Low Similarity (0-39%)', value: 0, color: '#10b981' },
    ];
    
    results.forEach(result => {
      const score = result.similarityScore * 100;
      if (score >= 70) {
        classifications[0].value++;
      } else if (score >= 40) {
        classifications[1].value++;
      } else {
        classifications[2].value++;
      }
    });
    
    return classifications.filter(item => item.value > 0);
  };
  
  const getBarFill = (value: number) => {
    if (value >= 70) return '#ef4444';
    if (value >= 40) return '#f59e0b';
    return '#10b981';
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 rounded-lg shadow-md border border-border/50 text-sm">
          <p className="font-medium mb-1">{`${data.value}% Similar`}</p>
          <p className="text-muted-foreground truncate max-w-[250px]">{`${data.fileA}`}</p>
          <p className="text-muted-foreground truncate max-w-[250px]">{`${data.fileB}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-background rounded-lg p-4 border border-border/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Similarity Overview</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-md transition-colors ${
              chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
            aria-label="Bar Chart"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`p-1.5 rounded-md transition-colors ${
              chartType === 'pie' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
            aria-label="Pie Chart"
          >
            <PieChartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 50 }}>
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fontSize: 12 }}
                height={100}
              />
              <YAxis 
                unit="%" 
                domain={[0, 100]} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarFill(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={createPieData()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {createPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsChart;
