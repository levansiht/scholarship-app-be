import { z } from 'zod';

export const AddCategoryDtoSchema = z.object({
  name: z.string().min(2).max(50).trim(),
});

export type AddCategoryDto = z.infer<typeof AddCategoryDtoSchema>;
