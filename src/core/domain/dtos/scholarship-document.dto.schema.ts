import { z } from 'zod';

export const UploadDocumentDtoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
});

export type UploadDocumentDtoType = z.infer<typeof UploadDocumentDtoSchema>;

export const validateUploadDocumentDto = (
  data: unknown,
): UploadDocumentDtoType => {
  return UploadDocumentDtoSchema.parse(data);
};
