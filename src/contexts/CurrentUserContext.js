import { createContext, useContext } from 'react';

export const CurrentUserContext = createContext(null);

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);

  if (!context) {
    throw new Error('useCurrentUser must be used within CurrentUserContext.Provider');
  }

  return context;
}
