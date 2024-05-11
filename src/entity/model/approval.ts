import type { Leave } from './leave';

export interface Approval {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  status: string;
  leaveId: number;
  user: {
    name: string;
  }
  leave: Leave;
}