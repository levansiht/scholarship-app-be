import type { PaginationDto } from '../models/pagination.dto';
import { PaginatedResult } from '../types';
import type { Result } from '../types/result.type';

export interface IUseCase<TCreateDTO, TUpdateDTO, TEntity, TCondition> {
  create(data: TCreateDTO): Promise<Result<string>>;
  getDetail(id: string): Promise<Result<TEntity | null>>;
  list(
    condition: TCondition,
    paging: PaginationDto,
  ): Promise<Result<PaginatedResult<TEntity>>>;
  update(id: string, data: TUpdateDTO): Promise<Result<boolean>>;
  delete(id: string): Promise<Result<boolean>>;
}
