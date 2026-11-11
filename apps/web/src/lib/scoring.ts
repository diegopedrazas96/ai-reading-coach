import type { MarkedWord, ReadingScore } from '@/types';

const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;

export function tokenize(text: string): string[] {
  return text.match(WORD_PATTERN) ?? [];
}

export function normalize(word: string): string {
  return word
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’]/g, "'")
    .toLowerCase();
}

/** Builds the suffix LCS table: table[i][j] = LCS length of a[i..] and b[j..]. */
function buildLcsTable(a: string[], b: string[]): number[][] {
  const table = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] =
        a[i] === b[j] ? 1 + table[i + 1][j + 1] : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  return table;
}

/**
 * Compares the reference text with what was heard.
 * LCS alignment avoids marking every following word wrong after one omission.
 */
export function evaluateReading(reference: string, speech: string): ReadingScore {
  const expected = tokenize(reference);
  const recognized = tokenize(speech);
  const a = expected.map(normalize);
  const b = recognized.map(normalize);
  const lcs = buildLcsTable(a, b);

  const marked: MarkedWord[] = expected.map((word) => ({ word, status: 'missed' }));
  const consumed = new Set<number>();

  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      marked[i].status = 'correct';
      consumed.add(j);
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  const matched = marked.filter((word) => word.status === 'correct').length;
  const total = expected.length;

  return {
    expected,
    recognized,
    marked,
    matched,
    total,
    accuracy: total ? Math.round((matched / total) * 100) : 0,
    extra: recognized.filter((_, index) => !consumed.has(index)),
  };
}
