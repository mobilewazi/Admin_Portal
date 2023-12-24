
export interface ResponseInterface<T> {
  statusCode: number;
  success: boolean;
  message: string;
  responseObject: T;
}
