export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly expose: boolean;

  constructor(message: string, options: { statusCode: number; code: string; expose?: boolean }) {
    super(message);
    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.expose = options.expose ?? options.statusCode < 500;
  }
}
