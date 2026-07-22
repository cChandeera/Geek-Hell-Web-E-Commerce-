export class ApiResponse<T = unknown> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data: T;
  public errors: unknown | null;
  public meta: { timestamp: string };

  constructor(statusCode: number, data: T, message = 'Success') {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = null;
    this.meta = { timestamp: new Date().toISOString() };
  }
}
