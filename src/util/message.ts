import { ResponseVO } from '@src/models/vo/responseVo';
import { ValidationError } from 'class-validator';


const version = '2.29.1';

export enum StatusCode {
  success = 200,
  badRequest = 400,
  conflict = 409,
  notFound = 404,
}

class Result {
  private statusCode: number;
  private code: number;
  private message: string;
  private data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString() {
    return {
      statusCode: this.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
        api: {
          version,
        },
      }),
    };
  }
}

export class MessageUtil {
  static success(data: object): ResponseVO {
    const result = new Result(
      StatusCode.success,
      StatusCode.success,
      'success',
      data,
    );

    return result.bodyToString();
  }

  static error(code: number = 1000, message: string) {
    const result = new Result(StatusCode.success, code, message);

    console.log(result.bodyToString());
    return result.bodyToString();
  }
}

export const parseValidationErrors = (errors: ValidationError[]): string => {
  const errorMessages = errors.reduce((acc, element) => {
    const property = Object.values(element.constraints as any).reduce(
      (_, valueproperty) => {
        return valueproperty;
      },
      '',
    );
    return `${acc} ${acc ? '-- ' : ''}${property}`;
  }, '');
  return `Required fields: ${errorMessages}`;
};
