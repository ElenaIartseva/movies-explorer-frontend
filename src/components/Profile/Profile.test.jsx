import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Profile } from './Profile.js';
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

vi.mock('../../utils/MainApi.js', () => ({
  userInformation: vi.fn(),
}));

import { userInformation } from '../../utils/MainApi.js';

function renderProfile(contextOverrides = {}) {
  const showInfoPopup = vi.fn();
  const setCurrentUser = vi.fn();

  render(
    <MemoryRouter>
      <CurrentUserContext.Provider
        value={{
          currentUser: {
            name: 'Елена',
            email: 'elena@mail.ru',
            _id: '1',
          },
          setCurrentUser,
          loggedIn: true,
          setLoggedIn: vi.fn(),
          showInfoPopup,
          clearSessionData: vi.fn(),
          ...contextOverrides,
        }}
      >
        <Profile />
      </CurrentUserContext.Provider>
    </MemoryRouter>
  );

  return { showInfoPopup, setCurrentUser };
}

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('сохраняет изменённые данные профиля', async () => {
    userInformation.mockResolvedValueOnce({
      name: 'Мария',
      email: 'new@mail.ru',
    });

    const { showInfoPopup, setCurrentUser } = renderProfile();

    fireEvent.click(
      screen.getByRole('button', { name: 'Редактирование данных профиля' })
    );

    fireEvent.change(screen.getByPlaceholderText('Имя'), {
      target: { name: 'name', value: 'Мария' },
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { name: 'email', value: 'new@mail.ru' },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(userInformation).toHaveBeenCalledWith({
        name: 'Мария',
        email: 'new@mail.ru',
      });
      expect(setCurrentUser).toHaveBeenCalled();
      expect(showInfoPopup).toHaveBeenCalledWith(
        'Данные успешно отредактированы!'
      );
    });
  });

  it('показывает ошибку при конфликте email', async () => {
    userInformation.mockRejectedValueOnce(409);
    const { showInfoPopup } = renderProfile();

    fireEvent.click(
      screen.getByRole('button', { name: 'Редактирование данных профиля' })
    );

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { name: 'email', value: 'exists@mail.ru' },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(showInfoPopup).toHaveBeenCalledWith(
        'Пользователь с таким email уже существует.'
      );
    });
  });
});
