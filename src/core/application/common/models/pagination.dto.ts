import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type PaginationDto = z.infer<typeof PaginationSchema>;

export function createPaginationDto(
  page: number = 1,
  limit: number = 10,
): PaginationDto {
  return PaginationSchema.parse({ page, limit });
}

export function getSkip(paging: PaginationDto): number {
  return (paging.page - 1) * paging.limit;
}

export function getTake(paging: PaginationDto): number {
  return paging.limit;
}
