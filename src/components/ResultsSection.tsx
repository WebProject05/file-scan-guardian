
import React, { useState } from 'react';
import { FileInfo } from '../utils/fileProcessor';
import { FileComparisonResult, compareFiles } from '../utils/similarityChecker';
import ResultsTable from './ResultsTable';
import ResultsChart from './ResultsChart';
import { AlertTriangle, X, FileText, Maximize2, Minimize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ResultsSectionProps {
  files: FileInfo[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ files }) => {
  const [results, setResults] = useState<FileComparisonResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<FileComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const handleAnalyze = () => {
    if (files.length < 2) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const comparisonResults = compareFiles(files);
      setResults(comparisonResults);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  const handleSelectResult = (result: FileComparisonResult) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };
  
  if (files.length < 2) {
    return (
      <div className="bg-muted/30 rounded-lg p-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Insufficient Files</h3>
        <p className="text-muted-foreground">
          Please upload at least two files to run a plagiarism check
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full animate-fade-in">
      {results.length === 0 ? (
        <div className="text-center">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-6"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                Analyzing...
              </>
            ) : (
              'Start Plagiarism Check'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Analysis Results</h2>
            <button
              className="p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? "Minimize" : "Expand"}
            >
              {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="space-y-8">
            {expanded && (
              <div className="animate-slide-down">
                <ResultsChart results={results} />
              </div>
            )}
            
            <div className="bg-background rounded-lg border border-border/50 overflow-hidden">
              <ResultsTable results={results} onSelectResult={handleSelectResult} />
            </div>
          </div>
          
          <div className="text-center pt-4">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
              onClick={handleAnalyze}
            >
              Re-run Analysis
            </button>
          </div>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedResult && (
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Similarity Details</DialogTitle>
              <DialogDescription>
                {Math.round(selectedResult.similarityScore * 100)}% similarity between files
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">{selectedResult.fileA.name}</h3>
                </div>
                <div className="bg-muted/30 p-4 rounded-md max-h-[300px] overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {selectedResult.fileA.content}
                  </pre>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">{selectedResult.fileB.name}</h3>
                </div>
                <div className="bg-muted/30 p-4 rounded-md max-h-[300px] overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {selectedResult.fileB.content}
                  </pre>
                </div>
              </div>
            </div>
            
            {selectedResult.matchedPhrases.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Common Phrases</h3>
                <div className="space-y-2">
                  {selectedResult.matchedPhrases.map((phrase, index) => (
                    <div key={index} className="bg-primary/10 text-primary p-3 rounded-md text-sm">
                      "{phrase}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ResultsSection;
