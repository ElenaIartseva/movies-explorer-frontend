import './Header.css';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/logo/logo-smile.svg';
import { Navigation } from '../Navigation/Navigation.js';
import { useScreen } from '../../hooks/useScreen.js';
import { HamburgerMenu } from '../HamburgerMenu/HamburgerMenu.js';
import { useCurrentUser } from '../../contexts/CurrentUserContext.js';

function Header() {
  const { loggedIn } = useCurrentUser();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isMobileLayout } = useScreen();

  const [burgerMenuActive, setBurgerMenuActive] = useState(false);

  const hamburgerClassName = `button header__hamburger-button${
    burgerMenuActive
      ? ' header__hamburger-button_clicked header__hamburger-button_opened'
      : ''
  }`;

  function renderHeaderMenu() {
    if (isMobileLayout && loggedIn) {
      return (
        <button
          className={hamburgerClassName}
          type="button"
          aria-label="меню с навигацией по приложению"
          onClick={() => setBurgerMenuActive(!burgerMenuActive)}
        />
      );
    }

    if (!loggedIn) {
      return (
        <div className="header__layout">
          <Link className="header__registration link" to="/signup">
            Регистрация
          </Link>
          <button
            name="button"
            type="button"
            className="header__button button"
            onClick={() => navigate('/signin')}
          >
            Войти
          </button>
        </div>
      );
    }

    return <Navigation />;
  }

  return (
    <>
      <header className="header-login">
        {(pathname === '/movies' ||
          pathname === '/saved-movies' ||
          pathname === '/profile') && (
          <Link to="/movies">
            <img
              className="header-logo"
              src={logo}
              alt="белый улыбающийся смайлик на зелёном фоне"
            />
          </Link>
        )}
        {renderHeaderMenu()}
      </header>

      {isMobileLayout && (
        <HamburgerMenu
          burgerMenuActive={burgerMenuActive}
          setBurgerMenuActive={setBurgerMenuActive}
        />
      )}
    </>
  );
}

export { Header };
