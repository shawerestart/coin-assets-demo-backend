import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Pagination } from '@src/types/pagination.type';
import * as _ from 'lodash';

export const GetPagination = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const _pagination = req.body.pagination || {};
    const MIN_PAGESIZE = 10;
    const MAX_PAGESIZE = 100;

    const paginationParams: Pagination = {
      page: 1,
      pageSize: MIN_PAGESIZE,
      sortBy: _.isArray(_pagination?.sortBy) ? _pagination?.sortBy : [],
      get limit() {
        return this.pageSize;
      },
      get skip() {
        return (this.page - 1) * this.limit;
      },
    };

    paginationParams.page = _pagination.page
      ? Math.abs(parseInt(_pagination.page.toString()))
      : 1;
    paginationParams.pageSize = _pagination.pageSize
      ? parseInt(_pagination.pageSize.toString())
      : MIN_PAGESIZE;

    if (paginationParams.pageSize < MIN_PAGESIZE) {
      paginationParams.pageSize = MIN_PAGESIZE;
    }
    if (paginationParams.pageSize > MAX_PAGESIZE) {
      paginationParams.pageSize = MAX_PAGESIZE;
    }
    return paginationParams;
  },
);
