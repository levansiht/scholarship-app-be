import { ApiProperty } from '@nestjs/swagger';

export class UploadApplicationDocumentsHttpDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Array of document files to upload (max 5 files, 10MB each)',
  })
  files!: Express.Multer.File[];
}

export class UploadApplicationDocumentsResponseDto {
  @ApiProperty({
    type: [String],
    description: 'Array of uploaded document URLs',
    example: [
      'https://project.supabase.co/storage/v1/object/public/application-documents/uuid/doc1.pdf',
      'https://project.supabase.co/storage/v1/object/public/application-documents/uuid/doc2.pdf',
    ],
  })
  urls!: string[];
}
