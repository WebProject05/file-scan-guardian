
import React, { useState } from 'react';
import { FileComparisonResult } from '../utils/similarityChecker';
import { ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from 'lucide-react';

interface ResultsTableProps {
  results: FileComparisonResult[];
  onSelectResult: (result: FileComparisonResult) => void;
}

type SortKey = 'score' | 'nameA' | 'nameB' | 'typeA' | 'typeB';
type SortDirection = 'asc' | 'desc';

const ResultsTable: React.FC<ResultsTableProps> = ({ results, onSelectResult }) => {
  const [sortKey, setSortKey] = useState<SortKey>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  
  const getSortedResults = () => {
    const sortedResults = [...results];
    
    sortedResults.sort((a, b) => {
      let comparison = 0;
      
      switch (sortKey) {
        case 'score':
          comparison = a.similarityScore - b.similarityScore;
          break;
        case 'nameA':
          comparison = a.fileA.name.localeCompare(b.fileA.name);
          break;
        case 'nameB':
          comparison = a.fileB.name.localeCompare(b.fileB.name);
          break;
        case 'typeA':
          comparison = a.fileA.type.localeCompare(b.fileA.type);
          break;
        case 'typeB':
          comparison = a.fileB.type.localeCompare(b.fileB.type);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return sortedResults;
  };
  
  const SortIcon = ({ currentKey }: { currentKey: SortKey }) => {
    if (sortKey !== currentKey) return <ChevronDown className="w-4 h-4 opacity-20" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };
  
  const formatSimilarityPercentage = (score: number) => {
    return Math.round(score * 100) + '%';
  };
  
  const getSeverityColor = (score: number) => {
    if (score >= 0.7) return 'text-destructive bg-destructive/10';
    if (score >= 0.4) return 'text-amber-500 bg-amber-500/10';
    return 'text-green-500 bg-green-500/10';
  };
  
  const sortedResults = getSortedResults();
  
  if (results.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Results</h3>
        <p className="text-muted-foreground">
          Upload two or more files to see similarity comparisons
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th 
              className="px-4 py-3 text-left font-medium cursor-pointer"
              onClick={() => handleSort('score')}
            >
              <div className="flex items-center">
                <span>Similarity</span>
                <SortIcon currentKey="score" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left font-medium cursor-pointer"
              onClick={() => handleSort('nameA')}
            >
              <div className="flex items-center">
                <span>File A</span>
                <SortIcon currentKey="nameA" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left font-medium cursor-pointer"
              onClick={() => handleSort('typeA')}
            >
              <div className="flex items-center">
                <span>Type</span>
                <SortIcon currentKey="typeA" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left font-medium cursor-pointer"
              onClick={() => handleSort('nameB')}
            >
              <div className="flex items-center">
                <span>File B</span>
                <SortIcon currentKey="nameB" />
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left font-medium cursor-pointer"
              onClick={() => handleSort('typeB')}
            >
              <div className="flex items-center">
                <span>Type</span>
                <SortIcon currentKey="typeB" />
              </div>
            </th>
            <th className="px-4 py-3 text-center font-medium">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((result) => (
            <tr 
              key={result.id} 
              className="border-b border-border hover:bg-muted/20 cursor-pointer transition-colors"
              onClick={() => onSelectResult(result)}
            >
              <td className="px-4 py-3">
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full font-medium text-xs ${getSeverityColor(result.similarityScore)}`}>
                  {formatSimilarityPercentage(result.similarityScore)}
                </div>
              </td>
              <td className="px-4 py-3 font-medium truncate max-w-[150px]">
                {result.fileA.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-sm">
                {result.fileA.type}
              </td>
              <td className="px-4 py-3 font-medium truncate max-w-[150px]">
                {result.fileB.name}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-sm">
                {result.fileB.type}
              </td>
              <td className="px-4 py-3 text-center">
                <button 
                  className="inline-flex items-center text-primary hover:underline text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectResult(result);
                  }}
                >
                  View <ExternalLink className="ml-1 w-3 h-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
