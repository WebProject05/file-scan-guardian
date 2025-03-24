
import React, { useState } from 'react';
import { FileInfo } from '../utils/fileProcessor';
import { FileComparisonResult, compareFiles, groupComparisonsByType, GroupedResults } from '../utils/similarityChecker';
import ResultsTable from './ResultsTable';
import ResultsChart from './ResultsChart';
import { AlertTriangle, X, FileText, Maximize2, Minimize2, Loader2, BarChart, PieChart, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FloatingCard from './FloatingCard';

interface ResultsSectionProps {
  files: FileInfo[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ files }) => {
  const [results, setResults] = useState<FileComparisonResult[]>([]);
  const [groupedResults, setGroupedResults] = useState<GroupedResults[]>([]);
  const [selectedResult, setSelectedResult] = useState<FileComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  
  const handleAnalyze = () => {
    if (files.length < 2) return;
    
    setIsAnalyzing(true);
    
    // Use setTimeout to avoid UI freezing during calculation
    setTimeout(() => {
      try {
        const comparisonResults = compareFiles(files);
        setResults(comparisonResults);
        
        // Group results by file type
        const grouped = groupComparisonsByType(comparisonResults);
        setGroupedResults(grouped);
        
        // Set active group to the first one if any exist
        if (grouped.length > 0) {
          setActiveGroup(grouped[0].group);
        }
      } catch (error) {
        console.error("Error analyzing files:", error);
      } finally {
        setIsAnalyzing(false);
      }
    }, 100);
  };
  
  const handleSelectResult = (result: FileComparisonResult) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };
  
  if (files.length < 2) {
    return (
      <FloatingCard className="bg-muted/30 p-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Insufficient Files</h3>
        <p className="text-muted-foreground">
          Please upload at least two files to run a plagiarism check
        </p>
      </FloatingCard>
    );
  }
  
  const filteredResults = activeGroup 
    ? groupedResults.find(group => group.group === activeGroup)?.comparisons || [] 
    : results;
  
  return (
    <div className="w-full animate-fade-in">
      {results.length === 0 ? (
        <FloatingCard className="p-8 text-center" delay={0.2}>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium 
                      ring-offset-background transition-colors focus-visible:outline-none 
                      focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                      disabled:pointer-events-none disabled:opacity-50 bg-primary 
                      text-primary-foreground hover:bg-primary/90 h-10 px-8 py-6"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Start Plagiarism Check'
            )}
          </button>
        </FloatingCard>
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
                <FloatingCard delay={0.1}>
                  <ResultsChart results={results} />
                </FloatingCard>
              </div>
            )}
            
            {groupedResults.length > 0 && (
              <FloatingCard className="p-4" delay={0.15}>
                <div className="flex items-center mb-4">
                  <Layers className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">File Type Groups</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {groupedResults.map((group) => (
                    <button
                      key={group.group}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeGroup === group.group 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary/50 hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                      onClick={() => setActiveGroup(group.group)}
                    >
                      {group.group} ({group.comparisons.length})
                    </button>
                  ))}
                  {activeGroup && (
                    <button
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground transition-colors"
                      onClick={() => setActiveGroup(null)}
                    >
                      Show All
                    </button>
                  )}
                </div>
              </FloatingCard>
            )}
            
            <FloatingCard delay={0.2}>
              <ResultsTable 
                results={filteredResults} 
                onSelectResult={handleSelectResult}
                activeGroup={activeGroup}
              />
            </FloatingCard>
          </div>
          
          <div className="text-center pt-4">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium 
                        ring-offset-background transition-colors focus-visible:outline-none 
                        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                        disabled:pointer-events-none disabled:opacity-50 bg-secondary 
                        text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2"
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
