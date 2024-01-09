import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const errorResponse = exception.getResponse() as { message: string[] };

      if (
        statusCode === HttpStatus.BAD_REQUEST &&
        Array.isArray(errorResponse.message)
      ) {
        const validationErrors = this.flattenValidationErrors(
          errorResponse.message,
        );
        const message =
          validationErrors?.[0] ||
          `${status >= 500 ? 'Service Error' : 'Client Error'}`;
        response.status(status).json({
          data: {},
          status: 500,
          message,
        });
        return;
      }
    }

    //   设置返回的状态码，请求头，发送错误信息
    response.status(status).json({
      status,
      path: request.url,
      error: exception.getResponse(),
    });
  }

  private flattenValidationErrors(errors: any[]): string[] {
    return errors.reduce((acc, error) => {
      if (error instanceof ValidationError) {
        acc.push(
          ...this.flattenValidationErrors(Object.values(error.constraints)),
        );
      } else if (Array.isArray(error)) {
        acc.push(...this.flattenValidationErrors(error));
      } else {
        acc.push(error);
      }
      return acc;
    }, []);
  }
}
