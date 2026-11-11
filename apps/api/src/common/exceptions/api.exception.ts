import { HttpException, type HttpStatus } from '@nestjs/common';
import type { ApiErrorCode } from '@reading-coach/shared';

/** HTTP exception that also carries a machine-readable error code for the client. */
export class ApiException extends HttpException {
  constructor(
    status: HttpStatus,
    message: string,
    public readonly code: ApiErrorCode,
  ) {
    super(message, status);
  }
}
