import type { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
}

export interface NotificationState {
  isOpen: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  autoHideDuration?: number;
}

export interface DispatchProps {
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export type NotificationAction = { type: 'OPEN_NOTIFICATION' | 'CLOSE_NOTIFICATION'; payload?: DispatchProps };