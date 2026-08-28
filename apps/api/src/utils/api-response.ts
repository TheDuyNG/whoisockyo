import type { Response } from 'express';

export function sendSuccess<T>(
  response: Response,
  statusCode: number,
  data: T,
  message: string,
): void {
  response.status(statusCode).json({ success: true, data, message });
}

export function sendNoContent(response: Response): void {
  response.status(204).send();
}
