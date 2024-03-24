import { NotificationState, NotificationAction } from './types'

export const reducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'OPEN_NOTIFICATION': {
      return {
        ...state,
        isOpen: true,
        ...action.payload
      };
    }

    case 'CLOSE_NOTIFICATION': {
      return {
        ...state,
        isOpen: false
      }
    }

    default:
      return { ...state };
  }
};