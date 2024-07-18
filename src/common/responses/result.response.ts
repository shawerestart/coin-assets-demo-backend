import * as _ from 'lodash';

export type PaginationResult = {
  list: any[];
  page: number;
  total: number;
  pageSize: number;
};

export class ResultResponse {
  static ok(data?: any) {
    const _data: any = !_.isEmpty(data) && _.isObject(data) ? data : {};
    return {
      ..._data,
    };
  }

  static fail() {
    return {};
  }

  static paginationOk({
    list,
    page,
    total,
    pageSize,
  }: PaginationResult): PaginationResult {
    return { list, page, total, pageSize };
  }
}
