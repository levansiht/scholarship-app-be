import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  IScholarshipDocumentRepository,
  CreateScholarshipDocumentData,
} from '../../core/domain/interfaces/repositories/scholarship-document.repository.interface';
import { ScholarshipDocument } from '../../core/domain/entities/scholarship-document.entity';
import { ScholarshipDocumentMapper } from '../../core/domain/mappers/scholarship-document.mapper';

@Injectable()
export class ScholarshipDocumentRepository
  implements IScholarshipDocumentRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateScholarshipDocumentData,
  ): Promise<ScholarshipDocument> {
    const document = await this.prisma.scholarshipDocument.create({
      data: {
        scholarshipId: data.scholarshipId,
        title: data.title,
        description: data.description ?? null,
        fileUrl: data.fileUrl,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      },
    });

    const domainDocument = ScholarshipDocumentMapper.toDomain(document);
    if (!domainDocument) {
      throw new Error('Failed to map document to domain');
    }

    return domainDocument;
  }

  async findById(id: string): Promise<ScholarshipDocument | null> {
    const document = await this.prisma.scholarshipDocument.findUnique({
      where: { id },
    });

    return document ? ScholarshipDocumentMapper.toDomain(document) : null;
  }

  async findByScholarshipId(
    scholarshipId: string,
  ): Promise<ScholarshipDocument[]> {
    const documents = await this.prisma.scholarshipDocument.findMany({
      where: { scholarshipId },
      orderBy: { uploadedAt: 'desc' },
    });

    return documents
      .map((doc) => ScholarshipDocumentMapper.toDomain(doc))
      .filter((doc): doc is ScholarshipDocument => doc !== null);
  }

  async delete(id: string): Promise<void> {
    const document = await this.prisma.scholarshipDocument.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.prisma.scholarshipDocument.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.scholarshipDocument.count({
      where: { id },
    });

    return count > 0;
  }
}
