import type { NestExpressApplication } from '@nestjs/platform-express';
import { API_PREFIX } from '@reading-coach/shared';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { appConfig, type AppConfig } from './config/app.config';

/** Cross-cutting app configuration, shared by `main.ts` and the e2e tests. */
export function configureApp(app: NestExpressApplication): AppConfig {
  const config = app.get<AppConfig>(appConfig.KEY);

  app.disable('x-powered-by');
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({ origin: config.corsOrigins });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks();

  return config;
}
