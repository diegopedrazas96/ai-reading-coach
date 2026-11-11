import { describe, expect, it } from 'vitest';
import { getRecordingFileName } from './audio';

describe('getRecordingFileName', () => {
  it.each([
    ['audio/mp4', 'reading.mp4'],
    ['audio/ogg;codecs=opus', 'reading.ogg'],
    ['audio/webm;codecs=opus', 'reading.webm'],
    ['', 'reading.webm'],
  ])('maps "%s" to %s', (mime, expected) => {
    expect(getRecordingFileName(mime)).toBe(expected);
  });
});
