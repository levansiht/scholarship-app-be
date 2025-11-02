import { BadRequestException } from '@nestjs/common';

export class UploadedFile {
  private static readonly MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];

  private static readonly ALLOWED_EXTENSIONS = [
    '.pdf',
    '.doc',
    '.docx',
    '.jpg',
    '.jpeg',
    '.png',
  ];

  private constructor(
    public readonly buffer: Buffer,
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly size: number,
  ) {}

  static create(file: Express.Multer.File): UploadedFile {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    this.validateFileSize(file.size, file.originalname);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    this.validateMimeType(file.mimetype, file.originalname);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    this.validateFileExtension(file.originalname);

    return new UploadedFile(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file.buffer,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file.originalname,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file.mimetype,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      file.size,
    );
  }

  static createMany(
    files: Express.Multer.File[],
    maxFiles: number = 5,
  ): UploadedFile[] {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    if (files.length > maxFiles) {
      throw new BadRequestException(
        `Maximum ${maxFiles} files allowed. You provided ${files.length} files.`,
      );
    }

    return files.map((file) => this.create(file));
  }

  private static validateFileSize(size: number, fileName: string): void {
    if (size > this.MAX_SIZE) {
      throw new BadRequestException(
        `File "${fileName}" exceeds maximum allowed size of ${this.MAX_SIZE / 1024 / 1024}MB`,
      );
    }

    if (size === 0) {
      throw new BadRequestException(`File "${fileName}" is empty`);
    }
  }

  private static validateMimeType(mimeType: string, fileName: string): void {
    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(
        `File "${fileName}" has invalid type "${mimeType}". Allowed types: PDF, DOC, DOCX, JPG, PNG`,
      );
    }
  }

  private static validateFileExtension(fileName: string): void {
    const extension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf('.'));

    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new BadRequestException(
        `File "${fileName}" has invalid extension "${extension}". Allowed extensions: ${this.ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }
  }

  get fileSizeFormatted(): string {
    if (this.size < 1024) {
      return `${this.size} bytes`;
    }
    if (this.size < 1024 * 1024) {
      return `${(this.size / 1024).toFixed(2)} KB`;
    }
    return `${(this.size / (1024 * 1024)).toFixed(2)} MB`;
  }

  get extension(): string {
    return this.originalName.substring(this.originalName.lastIndexOf('.'));
  }
}
