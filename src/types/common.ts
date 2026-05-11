export type PaginatedResponse<TData> = {
  data: Array<TData>;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  firstPage: number;
  nextPage: number;
  previousPage: number;
  lastPage: number;
  links: Array<LinkResponse>;
};

export type LinkResponse = {
  href: string;
  rel: string;
  method: string;
};

export type SelectItem = {
  label: string;
  value: string | number;
}