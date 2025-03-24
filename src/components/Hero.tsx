
import React from 'react';
import { Search, Shield, FileText, Database } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="container-custom py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full text-primary mb-4">
          <Shield className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Advanced Plagiarism Detection</span>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
          ScanSafe
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Detect similarities across multiple files with our powerful scan engine.
          Upload any file type and get instant analysis.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-lg mb-2">Universal Support</h3>
            <p className="text-muted-foreground text-sm">
              Analyze code, documents, and text files of any format
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-lg mb-2">Detailed Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Get precise similarity reports with matched content highlights
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-lg mb-2">Client-Side Processing</h3>
            <p className="text-muted-foreground text-sm">
              All analysis happens in your browser with no data sent to servers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
