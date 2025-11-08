import { z } from 'zod';
import { OrganizationType } from '../../../shared';

export const CreateSponsorProfileDtoSchema = z.object({
  organizationName: z.string().min(1).max(255),
  organizationType: z.nativeEnum(OrganizationType),
  description: z.string().min(1),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  taxId: z.string().min(1).max(50).optional(),
  contactEmail: z.string().email(),
});

export type CreateSponsorProfileDto = z.infer<
  typeof CreateSponsorProfileDtoSchema
>;

export const UpdateSponsorProfileDtoSchema = z.object({
  organizationName: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  taxId: z.string().min(1).max(50).optional(),
  contactEmail: z.string().email().optional(),
});

export type UpdateSponsorProfileDto = z.infer<
  typeof UpdateSponsorProfileDtoSchema
>;
