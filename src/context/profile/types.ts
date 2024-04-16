import type { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
}

export interface ProfileState {
  id: string;
  name:string;
  status:string;
  email:string;
  officeId:string;
  role:string;
  password:string;
  createdAt:string;
  updatedAt:string;
  isStrictRadius: boolean;
  isStrictDuration: boolean;
  office: {
    id: string;
    name: string;
    radius: number;
    createdAt: string;
    updatedAt: string;
    lat: string;
    long: string;
  };
  presences: {
    id: string;
    userId: string;
    officeId: string;
    clockInDate: string;
    createdAt: string;
    updatedAt: string;
    clockInDistance: number | null;
    clockInLat: string;
    clockInLong: string;
    clockOutDate: string | null;
    clockOutLat: string | null;
    clockOutLong: string | null;
    clockOutDistance: number | null;
  }[];
  refetch: () => void;
}

export interface DispatchProps {
  myProfile: any;
}

export type ProfileAction = { type: 'SET_PROFILE'; payload?: DispatchProps };