import { z } from 'zod';

export const AddRequirementDtoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  isRequired: z.boolean().optional().default(true),
  displayOrder: z.number().int().min(0).optional().default(0),
});

export type AddRequirementDtoType = z.infer<typeof AddRequirementDtoSchema>;

export const UpdateRequirementDtoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  isRequired: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export type UpdateRequirementDtoType = z.infer<
  typeof UpdateRequirementDtoSchema
>;

export const validateAddRequirementDto = (
  data: unknown,
): AddRequirementDtoType => {
  return AddRequirementDtoSchema.parse(data);
};

export const validateUpdateRequirementDto = (
  data: unknown,
): UpdateRequirementDtoType => {
  return UpdateRequirementDtoSchema.parse(data);
};
