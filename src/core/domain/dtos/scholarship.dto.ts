import { Currency, ScholarshipStatus } from '../../../shared/constants';

export interface CreateScholarshipDto {
  createdBy: string;
  title: string;
  slug: string;
  description: string;
  amount: number;
  currency: Currency;
  numberOfSlots: number;
  deadline: Date;
  startDate: Date;
  endDate?: Date;
  tags?: string[];
  thumbnailUrl?: string;
}

export interface UpdateScholarshipDto {
  title?: string;
  description?: string;
  deadline?: Date;
  numberOfSlots?: number;
  status?: ScholarshipStatus;
}
