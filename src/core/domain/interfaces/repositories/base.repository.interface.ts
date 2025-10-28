export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IRepositoryBase<TEntity, TCreateDto, TUpdateDto> {
  findById(id: string): Promise<TEntity | null>;
  findAll(params?: PaginationParams): Promise<PaginatedResult<TEntity>>;
  create(data: TCreateDto): Promise<TEntity>;
  update(id: string, data: TUpdateDto): Promise<TEntity>;
  delete(id: string): Promise<void>;
  count(params?: unknown): Promise<number>;
}
