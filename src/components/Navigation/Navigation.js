import './Navigation.css';
import { NavLink, Link } from 'react-router-dom';
import profileIcon from '../../images/button/profile_icon.svg';
import { useScreen } from '../../hooks/useScreen.js';

function Navigation(props) {
  const { active, setActive } = props;
  const { isMobileLayout } = useScreen();

  const links = [
    { path: '/movies', label: 'Фильмы' },
    { path: '/saved-movies', label: 'Сохранённые фильмы' },
  ];

  function closeMenu() {
    setActive?.(false);
  }

  function createNavigationLink(path, label) {
    return (
      <li key={label}>
        <NavLink
          className={({ isActive }) =>
            `link navigation__link${isActive ? ' navigation__link_active' : ''}`
          }
          to={path}
          onClick={closeMenu}
        >
          {label}
        </NavLink>
      </li>
    );
  }

  return (
    <div
      className={active ? 'navigation active' : 'navigation'}
      onClick={() => setActive?.(false)}
    >
      <nav className="navigation__container" onClick={(e) => e.stopPropagation()}>
        <ul className="navigation__list">
          {links.map(({ path, label }) => createNavigationLink(path, label))}
        </ul>

        <Link
          className="navigation__link navigation__link_type_profile"
          to="/profile"
          onClick={closeMenu}
        >
          Аккаунт
          <img src={profileIcon} alt="белый кружочек" />
        </Link>
      </nav>
    </div>
  );
}

export { Navigation };
