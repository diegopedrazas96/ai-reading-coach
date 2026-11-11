import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import {
  TRANSCRIPTION_PROVIDER,
  TranscriptionProviderError,
  type TranscriptionProvider,
} from '../src/transcription/providers/transcription-provider.interface';

const audio = Buffer.from('fake audio bytes');

function fakeProvider(overrides: Partial<TranscriptionProvider> = {}): TranscriptionProvider {
  return {
    isConfigured: true,
    transcribe: vi.fn().mockResolvedValue('the little cat'),
    ...overrides,
  };
}

let app: NestExpressApplication | undefined;

async function createApp(provider: TranscriptionProvider) {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(TRANSCRIPTION_PROVIDER)
    .useValue(provider)
    .compile();
  app = moduleRef.createNestApplication<NestExpressApplication>({ logger: false });
  configureApp(app);
  await app.init();
  return app.getHttpServer();
}

afterEach(async () => {
  await app?.close();
  app = undefined;
});

describe('GET /api/health', () => {
  it('reports whether transcription is configured', async () => {
    const server = await createApp(fakeProvider({ isConfigured: false }));
    const res = await request(server).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', transcriptionConfigured: false });
  });
});

describe('POST /api/transcribe', () => {
  it('returns 503 when no provider is configured', async () => {
    const server = await createApp(fakeProvider({ isConfigured: false }));
    const res = await request(server).post('/api/transcribe');
    expect(res.status).toBe(503);
    expect(res.body.code).toBe('TRANSCRIPTION_NOT_CONFIGURED');
  });

  it('returns 400 when no file is sent', async () => {
    const server = await createApp(fakeProvider());
    const res = await request(server).post('/api/transcribe');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 415 for unsupported formats', async () => {
    const server = await createApp(fakeProvider());
    const res = await request(server)
      .post('/api/transcribe')
      .attach('audio', audio, { filename: 'x.mp4', contentType: 'video/mp4' });
    expect(res.status).toBe(415);
  });

  it('returns 413 for files above the size limit', async () => {
    const server = await createApp(fakeProvider());
    const res = await request(server)
      .post('/api/transcribe')
      .attach('audio', Buffer.alloc(16 * 1024 * 1024), {
        filename: 'x.webm',
        contentType: 'audio/webm',
      });
    expect(res.status).toBe(413);
  });

  it('returns the transcript on success', async () => {
    const provider = fakeProvider();
    const server = await createApp(provider);
    const res = await request(server)
      .post('/api/transcribe')
      .attach('audio', audio, { filename: 'x.webm', contentType: 'audio/webm;codecs=opus' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ transcript: 'the little cat' });
    expect(provider.transcribe).toHaveBeenCalledOnce();
  });

  it.each([
    ['quota', 503, 'TRANSCRIPTION_QUOTA_EXCEEDED', /no credits/i],
    ['rate_limit', 429, 'TRANSCRIPTION_RATE_LIMITED', /rate limiting/i],
    ['auth', 502, 'TRANSCRIPTION_AUTH_FAILED', /api key/i],
    ['unknown', 502, 'TRANSCRIPTION_FAILED', /failed/i],
  ] as const)('maps a %s provider failure to %i', async (reason, status, code, message) => {
    const server = await createApp(
      fakeProvider({
        transcribe: vi.fn().mockRejectedValue(new TranscriptionProviderError(reason, 'boom')),
      }),
    );
    const res = await request(server)
      .post('/api/transcribe')
      .attach('audio', audio, { filename: 'x.webm', contentType: 'audio/webm' });
    expect(res.status).toBe(status);
    expect(res.body.code).toBe(code);
    expect(res.body.error).toMatch(message);
  });
});

describe('unknown routes', () => {
  it('return a JSON 404', async () => {
    const server = await createApp(fakeProvider());
    const res = await request(server).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeTypeOf('string');
  });
});
