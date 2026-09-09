import './App.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute.js';
import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

import {
  getUserIDInfo,
  getSavedMovies,
  saveCard,
  deleteCard,
  setUnauthorizedHandler,
} from '../../utils/MainApi.js';

import { Header } from '../Header/Header.js';
import { Footer } from '../Footer/Footer.js';
import { Movies } from '../Movies/Movies.js';
import { SavedMovies } from '../SavedMovies/SavedMovies.js';
import { Profile } from '../Profile/Profile.js';
import { Register } from '../Register/Register.js';
import { Login } from '../Login/Login.js';
import { NotFound } from '../NotFound/NotFound.js';
import { InfoPopup } from '../InfoPopup/InfoPopup.js';
import { Preloader } from '../Preloader/Preloader.js';
import { getMovieId } from '../../utils/getMovieId.js';

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isAuthChecking, setIsAuthChecking] = useState(
    !!localStorage.getItem('jwt')
  );
  const [savedCards, setSavedCards] = useState([]);
  const [infoPopup, setInfoPopup] = useState(false);
  const [infoPopupText, setInfoPopupText] = useState('');

  const initialLoggedIn = !!localStorage.getItem('jwt');
  const [loggedIn, setLoggedIn] = useState(initialLoggedIn);
  const [currentUser, setCurrentUser] = useState({});

  const showInfoPopup = useCallback((text) => {
    setInfoPopupText(text);
    setInfoPopup(true);
  }, []);

  const closeInfoPopup = useCallback(() => {
    setInfoPopup(false);
  }, []);

  const clearSessionData = useCallback(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('search');
    localStorage.removeItem('isShort');
    localStorage.removeItem('movies');
    localStorage.removeItem('savedMoviesSearch');
    localStorage.removeItem('savedMoviesIsShort');
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearSessionData();
    setLoggedIn(false);
    setCurrentUser({});
    setSavedCards([]);
    showInfoPopup('Сессия истекла. Войдите снова.');
    navigate('/signin', { replace: true });
  }, [clearSessionData, navigate, showInfoPopup]);

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
    return () => setUnauthorizedHandler(null);
  }, [handleUnauthorized]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!loggedIn || !token) {
      if (!token) {
        setLoggedIn(false);
      }
      setIsAuthChecking(false);
      return;
    }

    setIsAuthChecking(true);

    Promise.all([getUserIDInfo(token), getSavedMovies(token)])
      .then(([userInfo, savedMovies]) => {
        setCurrentUser({
          name: userInfo.name,
          email: userInfo.email,
          _id: userInfo._id,
        });
        setSavedCards(savedMovies);
      })
      .catch(() => {
        clearSessionData();
        setLoggedIn(false);
        setCurrentUser({});
      })
      .finally(() => {
        setIsAuthChecking(false);
      });
  }, [loggedIn, clearSessionData]);

  const handleSaveCard = useCallback(
    (card) => {
      const token = localStorage.getItem('jwt');

      return saveCard(card, token)
        .then((newCard) => {
          setSavedCards((prev) => [newCard, ...prev]);
        })
        .catch((error) => {
          if (error === 401) {
            return;
          }

          if (error === 409) {
            return getSavedMovies(token).then(setSavedCards);
          }

          showInfoPopup(
            'Не удалось сохранить фильм. Попробуйте ещё раз.'
          );
        });
    },
    [showInfoPopup]
  );

  const handleCardDelete = useCallback(
    (card) => {
      const token = localStorage.getItem('jwt');
      const movieId = getMovieId(card);
      const cardToDelete = savedCards.find((c) => getMovieId(c) === movieId);

      if (!cardToDelete) {
        return Promise.resolve();
      }

      return deleteCard(cardToDelete._id, token)
        .then(() => {
          setSavedCards((state) =>
            state.filter((c) => getMovieId(c) !== movieId)
          );
        })
        .catch((error) => {
          if (error === 401) {
            return;
          }

          showInfoPopup(
            'Не удалось удалить фильм. Попробуйте ещё раз.'
          );
        });
    },
    [savedCards, showInfoPopup]
  );

  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      loggedIn,
      setLoggedIn,
      showInfoPopup,
      clearSessionData,
    }),
    [currentUser, loggedIn, showInfoPopup, clearSessionData]
  );

  if (isAuthChecking) {
    return <Preloader />;
  }

  return (
    <CurrentUserContext.Provider value={contextValue}>
      <div className="page">
        {(pathname === '/movies' ||
          pathname === '/saved-movies' ||
          pathname === '/profile') && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <Navigate to="/movies" replace />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />

          <Route
            path="/movies"
            element={
              <ProtectedRoute
                element={Movies}
                onLikeCard={handleSaveCard}
                onDelete={handleCardDelete}
                savedCards={savedCards}
              />
            }
          />

          <Route
            path="/saved-movies"
            element={
              <ProtectedRoute
                element={SavedMovies}
                savedCards={savedCards}
                onDelete={handleCardDelete}
              />
            }
          />

          <Route path="/profile" element={<ProtectedRoute element={Profile} />} />

          <Route
            path="/signup"
            element={loggedIn ? <Navigate to="/movies" replace /> : <Register />}
          />

          <Route
            path="/signin"
            element={loggedIn ? <Navigate to="/movies" replace /> : <Login />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />

        <InfoPopup
          isOpen={infoPopup}
          title={infoPopupText}
          onSubmit={closeInfoPopup}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export { App };
