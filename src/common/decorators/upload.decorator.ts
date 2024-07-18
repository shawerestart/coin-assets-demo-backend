import {
  applyDecorators,
  HttpException,
  UnsupportedMediaTypeException,
  UseInterceptors,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiException } from '../exceptions/api.exception';
import { ErrorCode } from '../error-code.constants';

export function upload(fieldName = 'file', options: MulterOptions = {}) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)));
}

export function fileMimetypeFilter(...mimes: string[]) {
  return (
    req: any,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimes.some((mime) => file.mimetype.includes(mime))) {
      callback(null, true);
    } else {
      callback(new ApiException(ErrorCode.FILE_TYPE_ERROR), false);
      // callback(new UnsupportedMediaTypeException('文件类型错误'), false);
    }
  };
}

export function Image(field = 'file') {
  return upload(field, {
    limits: { fileSize: Math.pow(1024, 2) * 2 },
    fileFilter: fileMimetypeFilter('image'),
  } as MulterOptions);
}

export function Document(field = 'file') {
  return upload(field, {
    limits: { fileSize: Math.pow(1024, 2) * 5 },
    fileFilter: fileMimetypeFilter('document'),
  } as MulterOptions);
}
