import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from './Login.js';
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

vi.mock('../../utils/MainApi.js', () => ({
  login: vi.fn(),
}));

import { login } from '../../utils/MainApi.js';

function renderLogin(contextOverrides = {}) {
  const showInfoPopup = vi.fn();
  const setLoggedIn = vi.fn();
  const setCurrentUser = vi.fn();

  render(
    <MemoryRouter>
      <CurrentUserContext.Provider
        value={{
          currentUser: {},
          setCurrentUser,
          loggedIn: false,
          setLoggedIn,
          showInfoPopup,
          clearSessionData: vi.fn(),
          ...contextOverrides,
        }}
      >
        <Login />
      </CurrentUserContext.Provider>
    </MemoryRouter>
  );

  return { showInfoPopup, setLoggedIn, setCurrentUser };
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('показывает popup при неверных данных', async () => {
    login.mockRejectedValueOnce(401);
    const { showInfoPopup } = renderLogin();

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { name: 'email', value: 'user@mail.ru' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { name: 'password', value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(showInfoPopup).toHaveBeenCalledWith(
        'Вы ввели неправильный логин или пароль.'
      );
    });
  });

  it('сохраняет jwt и переходит в movies при успешном входе', async () => {
    login.mockResolvedValueOnce({
      jwt: 'token-123',
      name: 'Иван',
      email: 'user@mail.ru',
      _id: '42',
    });

    const { setLoggedIn, setCurrentUser } = renderLogin();

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { name: 'email', value: 'user@mail.ru' },
    });
    fireEvent.change(screen.getByPlaceholderText('Пароль'), {
      target: { name: 'password', value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(setLoggedIn).toHaveBeenCalledWith(true);
      expect(localStorage.getItem('jwt')).toBe('token-123');
      expect(setCurrentUser).toHaveBeenCalledWith({
        name: 'Иван',
        email: 'user@mail.ru',
        _id: '42',
      });
    });
  });
});
