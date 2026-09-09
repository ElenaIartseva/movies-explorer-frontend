import './SavedMovies.css';
import '../Movies/Movies.css';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchForm } from '../SearchForm/SearchForm.js';
import { MoviesCardList } from '../MoviesCardList/MoviesCardList.js';
import { useScreen } from '../../hooks/useScreen.js';
import { useMoviesFilter } from '../../hooks/useMoviesFilter.js';

function SavedMovies(props) {
  const { savedCards, onDelete } = props;

  const {
    searchQuery,
    filteredCards,
    isShortMovie,
    isInputError,
    handleSearchChange,
    handleShortMoviesChange,
    validateSearchSubmit,
    applyFilter,
    persistSearchState,
  } = useMoviesFilter(savedCards, { storageKey: 'savedMovies' });

  const { pathname } = useLocation();
  const [visibleCardsCount, setVisibleCardsCount] = useState(0);
  const { isDesktop, isTablet, isSmallTablet, isMobile } = useScreen();

  useEffect(() => {
    if (isDesktop || isTablet || isSmallTablet || isMobile) {
      setVisibleCardsCount(1000);
    }
  }, [isDesktop, isTablet, isSmallTablet, isMobile]);

  function handleSubmit(evt) {
    evt.preventDefault();
    if (!validateSearchSubmit()) {
      return;
    }
    applyFilter();
    persistSearchState();
  }

  return (
    <section className="saved-movies">
      <SearchForm
        onSubmit={handleSubmit}
        onChange={handleSearchChange}
        value={searchQuery}
        isError={isInputError}
        checked={isShortMovie}
        onCheckboxChange={handleShortMoviesChange}
      />
      {filteredCards.length > 0 ? (
        <MoviesCardList
          savedCards={filteredCards}
          visibleCardsCount={visibleCardsCount}
          onDelete={onDelete}
        />
      ) : savedCards.length === 0 && pathname === '/saved-movies' ? (
        <p className="movies-error movies-error_type_empty">
          У вас пока нет сохранённых фильмов
        </p>
      ) : savedCards.length !== 0 && pathname === '/saved-movies' ? (
        <p className="movies-error">Ничего не найдено</p>
      ) : (
        ''
      )}
    </section>
  );
}

export { SavedMovies };
