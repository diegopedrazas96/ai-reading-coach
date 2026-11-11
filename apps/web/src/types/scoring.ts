export type WordStatus = 'correct' | 'missed';

export interface MarkedWord {
  word: string;
  status: WordStatus;
}

export interface ReadingScore {
  expected: string[];
  recognized: string[];
  marked: MarkedWord[];
  matched: number;
  total: number;
  accuracy: number;
  extra: string[];
}
