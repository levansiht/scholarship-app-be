export class SavedScholarship {
  id: string;
  userId: string;
  scholarshipId: string;
  note?: string;
  createdAt: Date;

  constructor(data: SavedScholarship) {
    this.id = data.id;
    this.userId = data.userId;
    this.scholarshipId = data.scholarshipId;
    this.note = data.note;
    this.createdAt = data.createdAt;
  }
}
