import './Movies.css';
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { moviesApi } from '../../utils/MoviesApi.js';
import { SearchForm } from '../SearchForm/SearchForm.js';
import { MoviesCardList } from '../MoviesCardList/MoviesCardList.js';
import { Preloader } from '../Preloader/Preloader.js';
import { useScreen } from '../../hooks/useScreen.js';
import { useMoviesFilter } from '../../hooks/useMoviesFilter.js';

import {
  DESKTOP,
  TABLET,
  SMALLTABLET,
  MOBILE,
  DESKTOP_ADD,
  TABLET_ADD,
  MOBILE_ADD,
} from '../../utils/constants.js';

function Movies(props) {
  const { onLikeCard, onDelete, savedCards } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isErrorCards, setIsErrorCards] = useState(false);
  const [cards, setCards] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    filteredCards,
    isShortMovie,
    setIsShortMovie,
    isInputError,
    handleSearchChange,
    handleShortMoviesChange,
    validateSearchSubmit,
    applyFilter,
  } = useMoviesFilter(cards);

  const { pathname } = useLocation();
  const [visibleCardsCount, setVisibleCardsCount] = useState(0);
  const { isDesktop, isTablet, isSmallTablet, isMobile } = useScreen();

  const handleShowCards = useCallback(() => {
    if (isDesktop) {
      setVisibleCardsCount(DESKTOP);
    } else if (isTablet) {
      setVisibleCardsCount(TABLET);
    } else if (isSmallTablet) {
      setVisibleCardsCount(SMALLTABLET);
    } else if (isMobile) {
      setVisibleCardsCount(MOBILE);
    }
  }, [isDesktop, isTablet, isSmallTablet, isMobile]);

  useEffect(() => {
    handleShowCards();
  }, [handleShowCards]);

  function handleAddMore() {
    if (isDesktop) {
      setVisibleCardsCount((count) => count + DESKTOP_ADD);
    } else if (isTablet) {
      setVisibleCardsCount((count) => count + TABLET_ADD);
    } else if (isSmallTablet || isMobile) {
      setVisibleCardsCount((count) => count + MOBILE_ADD);
    }
  }

  const handleSearchMovies = () => {
    setHasSearched(true);

    if (cards.length !== 0) {
      setIsErrorCards(false);
      applyFilter();
      localStorage.setItem('search', JSON.stringify(searchQuery));
      localStorage.setItem('isShort', JSON.stringify(isShortMovie));
      localStorage.setItem('movies', JSON.stringify(cards));
      return;
    }

    setIsLoading(true);
    setIsSending(true);

    moviesApi
      .getMovies()
      .then((movies) => {
        setCards(movies);
        setIsErrorCards(false);
        localStorage.setItem('search', JSON.stringify(searchQuery));
        localStorage.setItem('isShort', JSON.stringify(isShortMovie));
        localStorage.setItem('movies', JSON.stringify(movies));
      })
      .catch(() => {
        setIsErrorCards(true);
      })
      .finally(() => {
        setIsLoading(false);
        setIsSending(false);
      });
  };

  useEffect(() => {
    if (localStorage.search && localStorage.isShort && localStorage.movies) {
      setSearchQuery(JSON.parse(localStorage.search));
      setIsShortMovie(JSON.parse(localStorage.isShort));
      setCards(JSON.parse(localStorage.movies));
      setHasSearched(true);
    }
  }, [setSearchQuery, setIsShortMovie]);

  function handleShortMoviesChangeWithStorage() {
    handleShortMoviesChange();
    localStorage.setItem('isShort', JSON.stringify(!isShortMovie));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!validateSearchSubmit()) {
      return;
    }
    handleShowCards();
    handleSearchMovies();
  }

  return (
    <section className="movies">
      <SearchForm
        onSubmit={handleSubmit}
        onChange={handleSearchChange}
        value={searchQuery}
        isError={isInputError}
        isSending={isSending}
        checked={isShortMovie}
        onCheckboxChange={handleShortMoviesChangeWithStorage}
      />
      {isLoading ? (
        <Preloader />
      ) : isErrorCards ? (
        <p className="movies-error">
          Во время запроса произошла ошибка. Возможно, проблема с соединением или
          сервер недоступен. Подождите немного и попробуйте ещё раз.
        </p>
      ) : filteredCards.length > 0 ? (
        <>
          <MoviesCardList
            cards={filteredCards}
            visibleCardsCount={visibleCardsCount}
            savedCards={savedCards}
            onLikeCard={onLikeCard}
            onDelete={onDelete}
          />
          {visibleCardsCount < filteredCards.length && (
            <button className="button movies__button" onClick={handleAddMore}>
              Ещё
            </button>
          )}
        </>
      ) : cards.length !== 0 && pathname === '/movies' ? (
        <p className="movies-error">Ничего не найдено</p>
      ) : !hasSearched && pathname === '/movies' ? (
        <p className="movies-error movies-error_type_empty">
          Введите ключевое слово, чтобы найти фильм
        </p>
      ) : (
        ''
      )}
    </section>
  );
}

export { Movies };
