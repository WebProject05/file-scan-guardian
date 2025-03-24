
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

// Simple tokenization function
const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Calculate similarity using Jaccard index (for demo purposes)
const calculateJaccardSimilarity = (textA: string, textB: string): number => {
  const tokensA = new Set(tokenize(textA));
  const tokensB = new Set(tokenize(textB));
  
  if (tokensA.size === 0 && tokensB.size === 0) return 0;
  
  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  
  return intersection.size / union.size;
};

// Find matching phrases (simple implementation for demo)
const findMatchingPhrases = (textA: string, textB: string, minLength: number = 5): string[] => {
  const matches: string[] = [];
  const wordsA = tokenize(textA);
  const wordsB = tokenize(textB);
  
  for (let i = 0; i <= wordsA.length - minLength; i++) {
    for (let j = 0; j <= wordsB.length - minLength; j++) {
      let matchLength = 0;
      
      while (
        i + matchLength < wordsA.length &&
        j + matchLength < wordsB.length &&
        wordsA[i + matchLength] === wordsB[j + matchLength]
      ) {
        matchLength++;
      }
      
      if (matchLength >= minLength) {
        const phrase = wordsA.slice(i, i + matchLength).join(' ');
        if (!matches.includes(phrase)) {
          matches.push(phrase);
        }
        i += matchLength - 1;
        break;
      }
    }
  }
  
  return matches.slice(0, 5); // Limit to top 5 matches for simplicity
};

export const compareFiles = (files: FileInfo[]): FileComparisonResult[] => {
  const results: FileComparisonResult[] = [];
  
  // Compare each file with every other file (n^2 complexity)
  for (let i = 0; i < files.length; i++) {
    for (let j = i + 1; j < files.length; j++) {
      const fileA = files[i];
      const fileB = files[j];
      
      const similarityScore = calculateJaccardSimilarity(fileA.content, fileB.content);
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
