import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  flatten,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiException } from '../exceptions/api.exception';
import { ErrorCode } from '../error-code.constants';

@Injectable()
export class GlobalValidationPipe implements PipeTransform {
  async transform(
    paramValue: any,
    { metatype: paramMetatype }: ArgumentMetadata,
  ) {
    if (!paramMetatype || !this.toValidate(paramMetatype)) {
      return paramValue;
    }
    const object = plainToClass(paramMetatype, paramValue);
    const errors = await validate(object, {
      whitelist: true, // 白名单选项
      forbidNonWhitelisted: true, // 禁用非白名单属性选项
      stopAtFirstError: true, // 碰到第一个错误就返回
      forbidUnknownValues: true, // 禁用未知的值
    });
    const errorList: string[] = [];
    const errObjList: ValidationError[] = [...errors];

    do {
      const e = errObjList.shift();
      if (!e) {
        break;
      }
      if (e.constraints) {
        for (const item in e.constraints) {
          if (item === 'whitelistValidation') {
            // 如果是白名单校验错误的，使用自定义的错误语句描述。
            errorList.push(`属性 ${e.property} 未定义!`);
          } else {
            errorList.push(e.constraints[item]);
          }
        }
      }
      if (e.children) {
        errObjList.push(...e.children);
      }
    } while (true);
    if (errorList.length > 0) {
      throw new ApiException(ErrorCode.INVALID_PARAMS, {
        errors: errorList,
      });
    }
    return object;
  }

  private toValidate(paramMetatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(paramMetatype);
  }
}
