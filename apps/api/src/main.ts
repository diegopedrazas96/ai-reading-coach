import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = configureApp(app);

  await app.listen(config.port);

  const logger = new Logger('Bootstrap');
  logger.log(`Reading Coach API: http://localhost:${config.port}`);
  if (!config.openaiApiKey) {
    logger.warn('OPENAI_API_KEY not set: only browser recognition mode is available.');
  }
}

void bootstrap();
