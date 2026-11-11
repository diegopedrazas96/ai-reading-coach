import { registerAs, type ConfigType } from '@nestjs/config';

const DEFAULT_CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

function parsePort(value: string | undefined, fallback: number): number {
  const port = Number(value ?? fallback);
  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new Error(`Invalid PORT value: "${value}"`);
  }
  return port;
}

function parseList(value: string | undefined, fallback: string[]): string[] {
  const items = value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items?.length ? items : fallback;
}

/** Typed, validated application configuration (fails fast at startup). */
export const appConfig = registerAs('app', () => ({
  port: parsePort(process.env.PORT, 3001),
  corsOrigins: parseList(process.env.CORS_ORIGINS, DEFAULT_CORS_ORIGINS),
  openaiApiKey: process.env.OPENAI_API_KEY?.trim() || undefined,
  transcriptionModel: process.env.OPENAI_TRANSCRIPTION_MODEL?.trim() || 'gpt-transcribe',
}));

export type AppConfig = ConfigType<typeof appConfig>;
