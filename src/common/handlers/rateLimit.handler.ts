import { ResultResponse } from '@common/responses/result.response';
import { ErrorCode } from '@common/error-code.constants';
import { clsNamespace } from '@common/request.middleware';
import { getErrorCodeNumber } from '@common/exceptions/api.exception';

const allowUrl = ['/api/files/images/'];

const rateLimitHandler = (request, response, next, options) => {
  const resBody = {
    code: getErrorCodeNumber(ErrorCode.TOO_MANY_REQUEST),
    data: ResultResponse.fail(),
    msg: ErrorCode.TOO_MANY_REQUEST,
    success: false,
    t: new Date().getTime(),
    traceID: clsNamespace.get('traceID'),
  };
  return response.status(options.statusCode).send(resBody);
};

const rateLimitSkipHandler = (request, response) => {
  if (request.path.includes(allowUrl)) {
    return true;
  }
  return false;
};

export { rateLimitHandler, rateLimitSkipHandler };
