import type { ApiErrorCode } from '@reading-coach/shared';

/** Error returned by our API, carrying the server's machine-readable code. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: ApiErrorCode,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Extracts a user-facing message from an unknown thrown value. */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
