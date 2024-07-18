import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiException } from './api.exception';
import { errorLogger } from '@common/logger';
import { clsNamespace } from '@common/request.middleware';
import { ErrorCode } from '../error-code.constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let code: number, data, msg: string, status: HttpStatus, success: boolean;

    // HttpException 错误
    if (exception instanceof HttpException) {
      const exceptionBody: any = exception.getResponse();

      // ApiException 是自定义的业务异常，数据结构有拓展，跟 HttpException 不同
      if (exception instanceof ApiException) {
        code = exceptionBody.code;
        data = exceptionBody.data || null;
        msg = exceptionBody.message;
        success = exceptionBody.success;
        status = HttpStatus.OK;
      } else {
        code = exception.getStatus();
        data = exceptionBody.message || null;
        msg = exceptionBody.error || exceptionBody.message;
        success = exceptionBody.success;
        status = exception.getStatus();
      }
    } else {
      // 系统错误
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 500;
      msg = ErrorCode.SYSTEM_ERROR;
      success = false;
      data = exception?.message || {};

      errorLogger.error(exception);
    }

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');

    const resBody = {
      code,
      data,
      msg,
      success,
      t: new Date().getTime(),
      traceID: clsNamespace.get('traceID'),
    };

    response.send(resBody);
  }
}
