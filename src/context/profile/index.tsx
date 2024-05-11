'use client';

import { createContext, useContext, useReducer, Dispatch, useEffect } from 'react';
import { reducer } from './reducer'

import type { FC } from 'react';
import type { Props, ProfileState, ProfileAction } from './types'

const initialState: ProfileState = {
  id: '',
  name: '',
  status: '',
  email: '',
  officeId: '',
  role: '',
  password: '',
  createdAt: '',
  updatedAt: '',
  isStrictRadius: true,
  isStrictDuration: true,
  office: {
    id: '',
    name: '',
    radius: 0,
    createdAt: '',
    updatedAt: '',
    lat: '',
    long: ''
  },
  presences: [],
  approvals: [],
  refetch: () => {},
};

const ContextState = createContext<ProfileState | undefined>(undefined);
const ContextDispatch = createContext<Dispatch<ProfileAction> | undefined>(undefined);

export const ProfileProvider: FC<Props> = (props) => {
  console.warn('[DEBUG] rendering ProfileProvider');
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const refetch = () => {
    console.warn('[DEBUG] Triger Fetch ME!');
      fetch(`/api/me`)
      .then((res) => res.json())
      .then((resObject) => {
        dispatch({ type: 'SET_PROFILE', payload: resObject });
      });
  }

  useEffect(() => {
    if (!state.id) {
      refetch();
    } else {
      localStorage.setItem('uuid', state.id);
    }
  }, [state.id]);

  return (
    <ContextState.Provider value={state}>
      <ContextDispatch.Provider value={dispatch}>
        {children}
      </ContextDispatch.Provider>
    </ContextState.Provider>
  )
};

export const useProfileState = (): ProfileState => {
  const context = useContext(ContextState);

  if (context === undefined) {
    throw new Error('Please use useLocaleState() within LocaleContextProvider.');
  }

  return context;
};

export const useProfileDispatch = (): Dispatch<ProfileAction> => {
  const context = useContext(ContextDispatch);

  if (context === undefined) {
    throw new Error('Please use useLocaleDispatch() within LocaleContextProvider.');
  }

  return context;
};

type FnUseContext = () => [ProfileState, Dispatch<ProfileAction>];
export const useProfileContext: FnUseContext = () => [useProfileState(), useProfileDispatch()];