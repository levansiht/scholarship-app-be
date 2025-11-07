import { z } from 'zod';

export const CreateStudentProfileDtoSchema = z.object({
  studentId: z.string().min(1).max(50).optional(),
  university: z.string().min(1).max(255),
  major: z.string().min(1).max(255),
  yearOfStudy: z.number().int().min(1).max(6),
  gpa: z.number().min(0).max(4).multipleOf(0.01), // 0.00 to 4.00 with 2 decimals
  expectedGradYear: z.number().int().min(2020).max(2050),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  achievements: z.any().optional(),
});

export type CreateStudentProfileDto = z.infer<
  typeof CreateStudentProfileDtoSchema
>;

export const UpdateStudentProfileDtoSchema = z.object({
  studentId: z.string().min(1).max(50).optional(),
  university: z.string().min(1).max(255).optional(),
  major: z.string().min(1).max(255).optional(),
  yearOfStudy: z.number().int().min(1).max(6).optional(),
  gpa: z.number().min(0).max(4).multipleOf(0.01).optional(),
  expectedGradYear: z.number().int().min(2020).max(2050).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  achievements: z.any().optional(),
});

export type UpdateStudentProfileDto = z.infer<
  typeof UpdateStudentProfileDtoSchema
>;
