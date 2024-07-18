export interface SortBy {
  name: string;
  by: 'ASC' | 'DESC';
}
export interface Pagination {
  page?: number;
  pageSize?: number;
  sortBy?: SortBy[];
  skip?: number;
  limit?: number;
}
