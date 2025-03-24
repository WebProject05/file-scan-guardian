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
  
  // Expanded list of programming languages and file types
  const extensionMap: Record<string, string> = {
    // Text and document formats
    'txt': 'Text',
    'doc': 'Word',
    'docx': 'Word',
    'pdf': 'PDF',
    'md': 'Markdown',
    'rtf': 'Rich Text',
    'odt': 'OpenDocument',
    
    // Web languages
    'html': 'HTML',
    'htm': 'HTML',
    'css': 'CSS',
    'scss': 'SASS',
    'less': 'LESS',
    'js': 'JavaScript',
    'jsx': 'React JSX',
    'ts': 'TypeScript',
    'tsx': 'React TSX',
    'json': 'JSON',
    'xml': 'XML',
    'svg': 'SVG',
    
    // Backend languages
    'py': 'Python',
    'rb': 'Ruby',
    'php': 'PHP',
    'java': 'Java',
    'c': 'C',
    'h': 'C Header',
    'cpp': 'C++',
    'hpp': 'C++ Header',
    'cs': 'C#',
    'go': 'Go',
    'rs': 'Rust',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'scala': 'Scala',
    'pl': 'Perl',
    'pm': 'Perl Module',
    'hs': 'Haskell',
    'lua': 'Lua',
    'r': 'R',
    'dart': 'Dart',
    
    // Database and config
    'sql': 'SQL',
    'yml': 'YAML',
    'yaml': 'YAML',
    'toml': 'TOML',
    'ini': 'INI',
    'env': 'Environment',
    'config': 'Config',
    
    // Shell scripts
    'sh': 'Shell',
    'bash': 'Bash',
    'ps1': 'PowerShell',
    'bat': 'Batch',
    
    // Other formats
    'csv': 'CSV',
    'tsv': 'TSV',
    'vue': 'Vue',
    'svelte': 'Svelte',
    'elm': 'Elm',
    'clj': 'Clojure',
    'ex': 'Elixir',
    'exs': 'Elixir Script',
    'fs': 'F#',
    'erl': 'Erlang',
    'coffee': 'CoffeeScript',
    'groovy': 'Groovy',
    'jl': 'Julia',
    'f': 'Fortran',
    'f90': 'Fortran 90',
    'f95': 'Fortran 95',
    'asm': 'Assembly',
    'bf': 'Brainfuck',
    'ml': 'OCaml',
    'lisp': 'Lisp',
    'd': 'D',
    'v': 'Verilog',
    'vhd': 'VHDL',
    'proto': 'Protocol Buffers',
    'graphql': 'GraphQL',
    'ipynb': 'Jupyter Notebook',
    'rmd': 'R Markdown',
    'nim': 'Nim',
    'zig': 'Zig',
    'cr': 'Crystal',
    
    // Additional languages
    'ada': 'Ada',
    'basic': 'BASIC',
    'cobol': 'COBOL',
    'crystal': 'Crystal',
    'dart': 'Dart',
    'delphi': 'Delphi',
    'elixir': 'Elixir',
    'erlang': 'Erlang',
    'fortran': 'Fortran',
    'fsharp': 'F#',
    'haskell': 'Haskell',
    'haxe': 'Haxe',
    'idl': 'IDL',
    'julia': 'Julia',
    'kotlin': 'Kotlin',
    'matlab': 'MATLAB',
    'ocaml': 'OCaml',
    'pascal': 'Pascal',
    'perl': 'Perl',
    'powershell': 'PowerShell',
    'prolog': 'Prolog',
    'racket': 'Racket',
    'raku': 'Raku',
    'rust': 'Rust',
    'scheme': 'Scheme',
    'smalltalk': 'Smalltalk',
    'solidity': 'Solidity',
    'tcl': 'Tcl',
    'vala': 'Vala',
    'vba': 'VBA',
    'vbnet': 'VB.NET',
    'vbscript': 'VBScript',
    'wasm': 'WebAssembly',
    'wolfram': 'Wolfram',
    'xl': 'Excel Formula'
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
