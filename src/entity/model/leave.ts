import type { Approval } from './approval';

export interface Leave {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  dateEnd: string;
  dateStart: string;
  dayCount: number;
  status: string;
  user: {
    name: string;
  }
  approvals: Approval[];
  title?: string;
  formattedDate?: string;
  formattedDay?: string;
}