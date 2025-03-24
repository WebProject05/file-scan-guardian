
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, Area, AreaChart, RadialBarChart, RadialBar, LineChart, Line, CartesianGrid } from 'recharts';
import { FileComparisonResult } from '../utils/similarityChecker';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Activity } from 'lucide-react';

interface ResultsChartProps {
  results: FileComparisonResult[];
}

type ChartType = 'bar' | 'pie' | 'area' | 'radial';

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
      typeA: result.fileA.type,
      typeB: result.fileB.type,
      fill: getGradientColor(result.similarityScore),
    }));
  
  // File type statistics
  const fileTypeStats = getFileTypeStatistics(results);
  
  // Classification data for pie chart
  const createPieData = () => {
    const classifications = [
      { name: 'High Similarity (70-100%)', value: 0, color: '#ef4444', gradient: 'url(#highGradient)' },
      { name: 'Medium Similarity (40-69%)', value: 0, color: '#f59e0b', gradient: 'url(#mediumGradient)' },
      { name: 'Low Similarity (0-39%)', value: 0, color: '#10b981', gradient: 'url(#lowGradient)' },
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
  
  function getGradientColor(value: number): string {
    if (value >= 0.7) return 'url(#highGradient)';
    if (value >= 0.4) return 'url(#mediumGradient)';
    return 'url(#lowGradient)';
  }
  
  function getFileTypeStatistics(results: FileComparisonResult[]) {
    const typeMap = new Map<string, { count: number, avgSimilarity: number }>();
    const typePairs = new Map<string, { count: number, totalSimilarity: number }>();
    
    // Count occurrences of each file type and collect similarity data
    results.forEach(result => {
      // Process file A
      if (!typeMap.has(result.fileA.type)) {
        typeMap.set(result.fileA.type, { count: 0, avgSimilarity: 0 });
      }
      typeMap.get(result.fileA.type)!.count++;
      
      // Process file B
      if (!typeMap.has(result.fileB.type)) {
        typeMap.set(result.fileB.type, { count: 0, avgSimilarity: 0 });
      }
      typeMap.get(result.fileB.type)!.count++;
      
      // Process type pair
      const typePair = [result.fileA.type, result.fileB.type].sort().join(' & ');
      if (!typePairs.has(typePair)) {
        typePairs.set(typePair, { count: 0, totalSimilarity: 0 });
      }
      const pairData = typePairs.get(typePair)!;
      pairData.count++;
      pairData.totalSimilarity += result.similarityScore;
    });
    
    // Calculate averages for type pairs
    typePairs.forEach((data, type) => {
      data.totalSimilarity = data.totalSimilarity / data.count;
    });
    
    return {
      types: Array.from(typeMap.entries()).map(([type, data]) => ({
        name: type,
        count: data.count,
        fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
      })),
      pairs: Array.from(typePairs.entries())
        .map(([type, data]) => ({
          name: type,
          value: Math.round(data.totalSimilarity * 100),
          count: data.count,
          fill: getGradientColor(data.totalSimilarity),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    };
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 rounded-lg shadow-md border border-border/50 text-sm">
          <p className="font-medium mb-1">{`${data.value}% Similar`}</p>
          <p className="text-muted-foreground truncate max-w-[250px]">{`${data.fileA}`}</p>
          <p className="text-muted-foreground truncate max-w-[250px]">{`${data.fileB}`}</p>
          <div className="mt-1 pt-1 border-t border-border/50">
            <p className="text-xs text-muted-foreground">{`${data.typeA} & ${data.typeB}`}</p>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  const GradientDefs = () => (
    <defs>
      <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  );
  
  const renderChartContent = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 50 }}>
              <GradientDefs />
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
              <Bar 
                dataKey="value" 
                barSize={40}
                animationDuration={1500}
                animationEasing="ease-in-out"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <GradientDefs />
              <Pie
                data={createPieData()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                animationDuration={1500}
                animationEasing="ease-in-out"
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {createPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.gradient} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fileTypeStats.pairs} margin={{ top: 5, right: 5, left: 5, bottom: 50 }}>
              <GradientDefs />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fontSize: 12 }}
                height={80}
              />
              <YAxis 
                unit="%" 
                domain={[0, 100]} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fillOpacity={0.8} 
                fill="url(#purpleGradient)" 
                activeDot={{ r: 6 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'radial':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="10%" 
              outerRadius="80%" 
              data={fileTypeStats.pairs}
              startAngle={180} 
              endAngle={0}
            >
              <GradientDefs />
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontWeight: 500 }}
                background
                dataKey="value"
                angleAxisId={0}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        );
          
      default:
        return null;
    }
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
          <button
            onClick={() => setChartType('area')}
            className={`p-1.5 rounded-md transition-colors ${
              chartType === 'area' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
            aria-label="Area Chart"
          >
            <LineChartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType('radial')}
            className={`p-1.5 rounded-md transition-colors ${
              chartType === 'radial' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
            }`}
            aria-label="Radial Chart"
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="h-[350px] w-full">
        {renderChartContent()}
      </div>
    </div>
  );
};

export default ResultsChart;
