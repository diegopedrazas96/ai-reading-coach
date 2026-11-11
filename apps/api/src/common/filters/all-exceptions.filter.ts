import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { ApiErrorResponse } from '@reading-coach/shared';
import type { Response } from 'express';
import { ApiException } from '../exceptions/api.exception';

function extractMessage(exception: HttpException): string {
  const response = exception.getResponse();
  if (typeof response === 'string') return response;
  const { message } = response as { message?: string | string[] };
  if (Array.isArray(message)) return message.join(' ');
  return message ?? exception.message;
}

/** Normalizes every error into the shared `{ error, code? }` response shape. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const body: ApiErrorResponse = { error: extractMessage(exception) };
      if (exception instanceof ApiException) body.code = exception.code;
      response.status(exception.getStatus()).json(body);
      return;
    }

    this.logger.error('Unhandled error', exception instanceof Error ? exception.stack : exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Unexpected server error.',
      code: 'INTERNAL_ERROR',
    } satisfies ApiErrorResponse);
  }
}
