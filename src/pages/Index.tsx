
import React, { useState } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import Hero from '../components/Hero';
import FileUploader from '../components/FileUploader';
import ResultsSection from '../components/ResultsSection';
import { FileInfo } from '../utils/fileProcessor';
import { Separator } from '@/components/ui/separator';
import { Github } from 'lucide-react';
import BackgroundAnimation from '../components/BackgroundAnimation';
import FloatingCard from '../components/FloatingCard';

const Index: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  
  const handleFilesProcessed = (processedFiles: FileInfo[]) => {
    setFiles(processedFiles);
  };
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground theme-transition">
        <BackgroundAnimation />
        <ThemeToggle />
        
        <header className="relative z-10">
          <Hero />
        </header>
        
        <main className="container-custom pb-24 relative z-10">
          <FloatingCard className="rounded-xl p-8 md:p-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Upload Files for Analysis
            </h2>
            
            <FileUploader onFilesProcessed={handleFilesProcessed} />
            
            {files.length > 0 && (
              <>
                <Separator className="my-12" />
                <ResultsSection files={files} />
              </>
            )}
          </FloatingCard>
        </main>
        
        <footer className="py-8 border-t border-border relative z-10">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} File Scan Guardian. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
