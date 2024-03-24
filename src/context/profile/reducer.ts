import { ProfileState, ProfileAction } from './types'

export const reducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case 'SET_PROFILE': {
      return {
        ...state,
        ...action.payload
      };
    }

    default:
      return { ...state };
  }
};