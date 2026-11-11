import { describe, expect, it } from 'vitest';
import { getAudioExtension, getBaseMimeType, isSupportedAudioType } from './audio';

describe('audio utils', () => {
  it('strips MIME parameters', () => {
    expect(getBaseMimeType('audio/webm;codecs=opus')).toBe('audio/webm');
  });

  it.each([
    ['audio/webm;codecs=opus', 'webm'],
    ['audio/ogg', 'ogg'],
    ['audio/x-wav', 'wav'],
    ['audio/mp4', 'mp4'],
    ['audio/mpeg', 'mp3'],
  ])('maps %s to .%s', (mime, ext) => {
    expect(getAudioExtension(mime)).toBe(ext);
  });

  it('rejects unsupported types', () => {
    expect(isSupportedAudioType('video/mp4')).toBe(false);
    expect(isSupportedAudioType('audio/webm;codecs=opus')).toBe(true);
  });
});
