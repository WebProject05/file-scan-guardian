
import React, { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileInfo, processFile } from '../utils/fileProcessor';
import { FileUp, X, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFilesProcessed: (files: FileInfo[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesProcessed }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const filePromises = Array.from(selectedFiles).map(processFile);
      const processedFiles = await Promise.all(filePromises);
      
      setFiles(prevFiles => {
        // Filter out duplicates based on name and content
        const newFiles = processedFiles.filter(newFile => 
          !prevFiles.some(existingFile => 
            existingFile.name === newFile.name && 
            existingFile.content === newFile.content
          )
        );
        
        const updatedFiles = [...prevFiles, ...newFiles];
        onFilesProcessed(updatedFiles);
        return updatedFiles;
      });
      
      if (processedFiles.length > 0) {
        toast({
          title: "Files uploaded successfully",
          description: `${processedFiles.length} file(s) added for analysis`,
        });
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Error uploading files",
        description: "There was a problem processing your files",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.id !== id);
      onFilesProcessed(updatedFiles);
      return updatedFiles;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`file-drop-area ${isDragging ? 'drag-active' : ''} ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <div className="flex flex-col items-center">
          <FileUp className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
          <p className="text-muted-foreground mb-4">Or click to browse</p>
          {isProcessing && (
            <div className="mt-4 flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
              <span>Processing files...</span>
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Uploaded Files ({files.length})
          </h3>
          
          <div className="max-h-[300px] overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div 
                key={file.id}
                className="file-item"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center">
                  <span className="inline-block py-1 px-2 rounded-full text-xs font-medium bg-primary/10 text-primary mr-3">
                    {file.type}
                  </span>
                  <span className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-3">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button 
                    className="p-1 hover:bg-secondary rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
