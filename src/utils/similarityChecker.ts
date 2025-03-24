
import { FileInfo } from './fileProcessor';

export interface SimilarityResult {
  fileA: string;
  fileB: string;
  similarityScore: number;
  matchedPhrases: string[];
}

export interface FileComparisonResult {
  id: string;
  fileA: FileInfo;
  fileB: FileInfo;
  similarityScore: number;
  matchedPhrases: string[];
}

export interface GroupedResults {
  group: string;
  comparisons: FileComparisonResult[];
}

// Enhanced tokenization with programming language awareness
const tokenize = (text: string, fileType: string): string[] => {
  // Remove comments for code files based on language
  let withoutComments = text;
  
  // Language-specific comment removal
  if (['JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'Go', 'Swift', 'Kotlin', 'PHP', 'Rust'].includes(fileType)) {
    // Remove // and /* */ style comments
    withoutComments = text
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
  } else if (['Python', 'Ruby', 'R', 'Julia', 'Perl'].includes(fileType)) {
    // Remove # style comments
    withoutComments = text.replace(/#.*$/gm, '');
  } else if (['HTML', 'XML', 'SVG'].includes(fileType)) {
    // Remove <!-- --> style comments
    withoutComments = text.replace(/<!--[\s\S]*?-->/g, '');
  } else if (['SQL'].includes(fileType)) {
    // Remove -- and /* */ style comments
    withoutComments = text
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
  }
  
  // Process based on file type
  if (['Text', 'Markdown', 'Word', 'PDF', 'Rich Text'].includes(fileType)) {
    // For text files, do more natural language processing
    return withoutComments
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2); // Filter out very short words
  } else {
    // For code files, preserve more structure but normalize whitespace
    return withoutComments
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .split(/[\s{}();.,=:<>[\]]/g)
      .filter(token => token.length > 0);
  }
};

// Calculate similarity using improved algorithm with language awareness
const calculateSimilarity = (textA: string, typeA: string, textB: string, typeB: string): number => {
  // Handle empty files
  if (!textA.trim() && !textB.trim()) return 1; // Two empty files are considered identical
  if (!textA.trim() || !textB.trim()) return 0;
  
  const tokensA = tokenize(textA, typeA);
  const tokensB = tokenize(textB, typeB);
  
  // Calculate Jaccard similarity (set-based)
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  const jaccardSimilarity = intersection.size / union.size;
  
  // Calculate sequence-based similarity (for detecting code blocks)
  const sequenceSimilarity = calculateSequenceSimilarity(tokensA, tokensB);
  
  // Weight the two similarity measures based on file types
  const isCode = !['Text', 'Markdown', 'Word', 'PDF', 'Rich Text'].includes(typeA) || 
                !['Text', 'Markdown', 'Word', 'PDF', 'Rich Text'].includes(typeB);
  
  // Favor sequence matching for code files
  return isCode 
    ? 0.3 * jaccardSimilarity + 0.7 * sequenceSimilarity 
    : 0.6 * jaccardSimilarity + 0.4 * sequenceSimilarity;
};

// Helper function to calculate sequence-based similarity
const calculateSequenceSimilarity = (tokensA: string[], tokensB: string[]): number => {
  const matches = findLongestCommonSubsequences(tokensA, tokensB, 3);
  
  // Calculate the total length of matched sequences
  const totalMatchLength = matches.reduce((sum, seq) => sum + seq.length, 0);
  
  // Calculate the proportion of matched content
  const maxLength = Math.max(tokensA.length, tokensB.length);
  if (maxLength === 0) return 0;
  
  return Math.min(1, totalMatchLength / maxLength);
};

// Find matching phrases with improved algorithm for code detection
const findMatchingPhrases = (textA: string, typeA: string, textB: string, typeB: string, minLength: number = 4): string[] => {
  const matches: string[] = [];
  const tokensA = tokenize(textA, typeA);
  const tokensB = tokenize(textB, typeB);
  
  const commonSequences = findLongestCommonSubsequences(tokensA, tokensB, minLength);
  
  // Convert token sequences back to phrases
  return commonSequences
    .map(sequence => sequence.join(' '))
    .slice(0, 5); // Limit to top 5 matches for UI display
};

// Find all common subsequences of at least minLength
const findLongestCommonSubsequences = (tokensA: string[], tokensB: string[], minLength: number): string[][] => {
  const sequences: string[][] = [];
  
  for (let i = 0; i < tokensA.length; i++) {
    for (let j = 0; j < tokensB.length; j++) {
      if (tokensA[i] === tokensB[j]) {
        // Found a match, try to extend it
        let matchLength = 1;
        while (
          i + matchLength < tokensA.length &&
          j + matchLength < tokensB.length &&
          tokensA[i + matchLength] === tokensB[j + matchLength]
        ) {
          matchLength++;
        }
        
        if (matchLength >= minLength) {
          sequences.push(tokensA.slice(i, i + matchLength));
          i += matchLength - 1; // Skip ahead
          break;
        }
      }
    }
  }
  
  // Sort by length (descending)
  return sequences.sort((a, b) => b.length - a.length);
};

export const compareFiles = (files: FileInfo[]): FileComparisonResult[] => {
  const results: FileComparisonResult[] = [];
  
  // Compare each file with every other file
  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const fileA = files[i];
      const fileB = files[j];
      
      const similarityScore = calculateSimilarity(fileA.content, fileA.type, fileB.content, fileB.type);
      const matchedPhrases = findMatchingPhrases(fileA.content, fileA.type, fileB.content, fileB.type);
      
      results.push({
        id: `${fileA.id}-${fileB.id}`,
        fileA,
        fileB,
        similarityScore,
        matchedPhrases
      });
    }
  }
  
  // Sort by similarity score (descending)
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
};

// Group results by file type pairs
export const groupComparisonsByType = (results: FileComparisonResult[]): GroupedResults[] => {
  const groupedMap = new Map<string, FileComparisonResult[]>();
  
  results.forEach(result => {
    // Create a consistent group name regardless of order
    const types = [result.fileA.type, result.fileB.type].sort();
    const groupName = types[0] === types[1] ? types[0] : `${types[0]} & ${types[1]}`;
    
    if (!groupedMap.has(groupName)) {
      groupedMap.set(groupName, []);
    }
    
    groupedMap.get(groupName)?.push(result);
  });
  
  // Convert map to array of groups
  return Array.from(groupedMap.entries()).map(([group, comparisons]) => ({
    group,
    comparisons
  }));
};
