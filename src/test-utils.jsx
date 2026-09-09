import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CurrentUserContext } from './contexts/CurrentUserContext.js';

export function createMockUserContext(overrides = {}) {
  return {
    currentUser: { name: 'Тест', email: 'test@mail.ru', _id: '1' },
    setCurrentUser: () => {},
    loggedIn: true,
    setLoggedIn: () => {},
    showInfoPopup: () => {},
    clearSessionData: () => {},
    ...overrides,
  };
}

export function renderWithProviders(ui, { route = '/', contextValue } = {}) {
  const value = contextValue || createMockUserContext();

  return {
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <CurrentUserContext.Provider value={value}>
          {ui}
        </CurrentUserContext.Provider>
      </MemoryRouter>
    ),
    contextValue: value,
  };
}
