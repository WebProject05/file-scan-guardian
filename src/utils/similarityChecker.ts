
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

// Improved tokenization function with better handling for code and text
const tokenize = (text: string): string[] => {
  // Remove comments for code files (both // and /* */ style)
  const withoutComments = text
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
    
  return withoutComments
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Calculate similarity using a combined approach of Jaccard index and sequence matching
const calculateSimilarity = (textA: string, textB: string): number => {
  // Handle empty files
  if (!textA.trim() && !textB.trim()) return 1; // Two empty files are considered identical
  if (!textA.trim() || !textB.trim()) return 0;
  
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  
  // Calculate Jaccard similarity (set-based)
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  const jaccardSimilarity = intersection.size / union.size;
  
  // Calculate sequence-based similarity (for detecting code blocks)
  const sequenceSimilarity = calculateSequenceSimilarity(tokensA, tokensB);
  
  // Weight the two similarity measures (favoring sequence similarity for code detection)
  return 0.4 * jaccardSimilarity + 0.6 * sequenceSimilarity;
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
const findMatchingPhrases = (textA: string, textB: string, minLength: number = 4): string[] => {
  const matches: string[] = [];
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  
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
      
      const similarityScore = calculateSimilarity(fileA.content, fileB.content);
      const matchedPhrases = findMatchingPhrases(fileA.content, fileB.content);
      
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
