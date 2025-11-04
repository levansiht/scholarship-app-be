export interface ScholarshipDocumentProps {
  id: string;
  scholarshipId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: number; // in bytes
  mimeType: string;
  uploadedAt: Date;
}

export class ScholarshipDocument {
  private constructor(private readonly props: ScholarshipDocumentProps) {}

  static create(props: ScholarshipDocumentProps): ScholarshipDocument {
    return new ScholarshipDocument(props);
  }

  get id(): string {
    return this.props.id;
  }

  get scholarshipId(): string {
    return this.props.scholarshipId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get fileUrl(): string {
    return this.props.fileUrl;
  }

  get fileSize(): number {
    return this.props.fileSize;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get uploadedAt(): Date {
    return this.props.uploadedAt;
  }

  toJSON() {
    return {
      id: this.id,
      scholarshipId: this.scholarshipId,
      title: this.title,
      description: this.description,
      fileUrl: this.fileUrl,
      fileSize: this.fileSize,
      mimeType: this.mimeType,
      uploadedAt: this.uploadedAt,
    };
  }
}
