export class ScholarshipCategory {
  id: string;
  scholarshipId: string;
  name: string;
  createdAt: Date;

  constructor(data: ScholarshipCategory) {
    this.id = data.id;
    this.scholarshipId = data.scholarshipId;
    this.name = data.name;
    this.createdAt = data.createdAt;
  }
}
