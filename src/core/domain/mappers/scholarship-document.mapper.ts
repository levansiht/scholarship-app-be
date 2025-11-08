import {
  ScholarshipDocument as PrismaScholarshipDocument,
  Prisma,
} from '@prisma/client';
import {
  ScholarshipDocument,
  ScholarshipDocumentProps,
} from '../entities/scholarship-document.entity';

export class ScholarshipDocumentMapper {
  static toDomain(
    prisma: PrismaScholarshipDocument,
  ): ScholarshipDocument | null {
    if (!prisma) return null;

    const props: ScholarshipDocumentProps = {
      id: prisma.id,
      scholarshipId: prisma.scholarshipId,
      title: prisma.title,
      description: prisma.description ?? undefined,
      fileUrl: prisma.fileUrl,
      fileSize: prisma.fileSize,
      mimeType: prisma.mimeType,
      uploadedAt: prisma.uploadedAt,
    };

    return ScholarshipDocument.create(props);
  }

  static toPrisma(
    domain: ScholarshipDocument,
  ): Prisma.ScholarshipDocumentCreateInput {
    return {
      id: domain.id,
      title: domain.title,
      description: domain.description ?? null,
      fileUrl: domain.fileUrl,
      fileSize: domain.fileSize,
      mimeType: domain.mimeType,
      uploadedAt: domain.uploadedAt,
      scholarship: {
        connect: { id: domain.scholarshipId },
      },
    };
  }
}
