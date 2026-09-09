import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.js';
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

function ProtectedPage() {
  return <div>Protected content</div>;
}

function SignInPage() {
  return <div>Sign in page</div>;
}

function renderProtectedRoute(loggedIn) {
  return render(
    <MemoryRouter initialEntries={['/movies']}>
      <CurrentUserContext.Provider
        value={{
          currentUser: {},
          setCurrentUser: () => {},
          loggedIn,
          setLoggedIn: () => {},
          showInfoPopup: () => {},
          clearSessionData: () => {},
        }}
      >
        <Routes>
          <Route
            path="/movies"
            element={<ProtectedRoute element={ProtectedPage} />}
          />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </CurrentUserContext.Provider>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  it('рендерит защищённую страницу для авторизованного пользователя', () => {
    renderProtectedRoute(true);
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('перенаправляет неавторизованного пользователя на /signin', () => {
    renderProtectedRoute(false);
    expect(screen.getByText('Sign in page')).toBeInTheDocument();
  });
});
