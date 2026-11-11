import { describe, expect, it } from 'vitest';
import { evaluateReading, tokenize } from './scoring';

describe('evaluateReading', () => {
  it('ignores punctuation and casing', () => {
    expect(evaluateReading('The CAT sleeps.', 'the cat sleeps').accuracy).toBe(100);
  });

  it('handles omitted words without shifting the rest', () => {
    const result = evaluateReading('The little cat is sleeping', 'the cat is sleeping');
    expect(result.accuracy).toBe(80);
    expect(result.marked[1].status).toBe('missed');
    expect(result.marked[4].status).toBe('correct');
  });

  it('tracks extra words', () => {
    expect(evaluateReading('The cat', 'the fluffy cat').extra).toEqual(['fluffy']);
  });

  it('never divides by zero', () => {
    expect(evaluateReading('', '').accuracy).toBe(0);
  });
});

describe('tokenize', () => {
  it('keeps apostrophes inside words', () => {
    expect(tokenize("Don't stop!")).toEqual(["Don't", 'stop']);
  });
});
