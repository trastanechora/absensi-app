'use client';

import { createContext, useContext, useReducer, Dispatch } from 'react';
import { reducer } from './reducer'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import type { FC } from 'react';
import type { Props, NotificationState, NotificationAction } from './types'

const initialState: NotificationState = {
  isOpen: false,
  message: '',
  severity: 'success',
  autoHideDuration: 7000,
};

const ContextState = createContext<NotificationState | undefined>(undefined);
const ContextDispatch = createContext<Dispatch<NotificationAction> | undefined>(undefined);

export const NotificationProvider: FC<Props> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({ type: 'CLOSE_NOTIFICATION' });
  };

  return (
    <ContextState.Provider value={state}>
      <ContextDispatch.Provider value={dispatch}>
        {children}
        <Snackbar
          open={state.isOpen}
          autoHideDuration={state.autoHideDuration}
          onClose={handleClose}
        >
          <Alert variant="filled" onClose={handleClose} severity={state.severity} sx={{ width: '100%' }}>
            {state.message}
          </Alert>
        </Snackbar>
      </ContextDispatch.Provider>
    </ContextState.Provider>
  )
};

export const useNotificationState = (): NotificationState => {
  const context = useContext(ContextState);

  if (context === undefined) {
    throw new Error('Please use useLocaleState() within LocaleContextProvider.');
  }

  return context;
};

export const useNotificationDispatch = (): Dispatch<NotificationAction> => {
  const context = useContext(ContextDispatch);

  if (context === undefined) {
    throw new Error('Please use useLocaleDispatch() within LocaleContextProvider.');
  }

  return context;
};

type FnUseContext = () => [NotificationState, Dispatch<NotificationAction>];
export const useNotificationContext: FnUseContext = () => [useNotificationState(), useNotificationDispatch()];