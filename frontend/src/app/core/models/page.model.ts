export interface PageResponse<T> {
  content:          T[];
  totalElements:    number;
  totalPages:       number;
  size:             number;
  number:           number;
  first:            boolean;
  last:             boolean;
  numberOfElements: number;
}

export interface Stats {
  lostCount:  number;
  foundCount: number;
  totalCount: number;
}
