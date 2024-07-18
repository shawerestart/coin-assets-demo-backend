import { HttpException, HttpStatus } from '@nestjs/common';
import { BASE_CODE_NUMBER, ErrorCode } from '../error-code.constants';
import { ResultResponse } from '../responses/result.response';

const getErrorCodeNumber = (message: ErrorCode): number => {
  let code = 0;
  Object.keys(ErrorCode).forEach((key, index) => {
    if (key === message) {
      code = index + BASE_CODE_NUMBER;
    }
  });
  return code;
};
/**
 * 业务异常（字符串模式）
 */
class ApiException extends HttpException {
  constructor(message: ErrorCode, data?: any) {
    const result = ResultResponse.fail();
    const code = getErrorCodeNumber(message);
    super(
      {
        code,
        message,
        data: {
          ...result,
          ...data,
        },
        success: false,
      },
      HttpStatus.OK,
    );
  }
}

export { getErrorCodeNumber, ApiException };
