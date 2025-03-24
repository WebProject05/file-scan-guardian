
export interface FileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
}

export const processFile = async (file: File): Promise<FileInfo> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        resolve({
          id: generateUniqueId(),
          name: file.name,
          type: getFileType(file),
          size: file.size,
          content
        });
      } catch (error) {
        reject(new Error(`Failed to process file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

const getFileType = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Map common extensions to more readable types
  const extensionMap: Record<string, string> = {
    'txt': 'Text',
    'doc': 'Word',
    'docx': 'Word',
    'pdf': 'PDF',
    'py': 'Python',
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'tsx': 'React',
    'jsx': 'React',
    'html': 'HTML',
    'css': 'CSS',
    'java': 'Java',
    'c': 'C',
    'cpp': 'C++',
    'cs': 'C#',
    'rb': 'Ruby',
    'php': 'PHP',
    'md': 'Markdown',
    'json': 'JSON',
    'xml': 'XML',
    'csv': 'CSV',
  };
  
  return extensionMap[extension] || 'Unknown';
};

const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
