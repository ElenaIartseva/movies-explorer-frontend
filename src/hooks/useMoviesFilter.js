import { useState, useCallback, useEffect } from 'react';
import { filterMoviesByQuery } from '../utils/filterMovies.js';

export function useMoviesFilter(movies, { storageKey = null } = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [isShortMovie, setIsShortMovie] = useState(false);
  const [isInputError, setIsInputError] = useState(false);

  const applyFilter = useCallback(() => {
    setFilteredCards(filterMoviesByQuery(movies, searchQuery, isShortMovie));
  }, [movies, searchQuery, isShortMovie]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    const savedSearch = localStorage.getItem(`${storageKey}Search`);
    const savedIsShort = localStorage.getItem(`${storageKey}IsShort`);

    if (savedSearch) {
      setSearchQuery(JSON.parse(savedSearch));
    }

    if (savedIsShort) {
      setIsShortMovie(JSON.parse(savedIsShort));
    }
  }, [storageKey]);

  const persistSearchState = useCallback(() => {
    if (!storageKey) {
      return;
    }

    localStorage.setItem(`${storageKey}Search`, JSON.stringify(searchQuery));
    localStorage.setItem(`${storageKey}IsShort`, JSON.stringify(isShortMovie));
  }, [storageKey, searchQuery, isShortMovie]);

  const handleSearchChange = (evt) => {
    setSearchQuery(evt.target.value);
  };

  const handleShortMoviesChange = () => {
    setIsShortMovie((prev) => {
      const nextValue = !prev;

      if (storageKey) {
        localStorage.setItem(`${storageKey}IsShort`, JSON.stringify(nextValue));
      }

      return nextValue;
    });
  };

  const validateSearchSubmit = () => {
    if (searchQuery === '') {
      setIsInputError(true);
      return false;
    }

    setIsInputError(false);
    return true;
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredCards,
    isShortMovie,
    setIsShortMovie,
    isInputError,
    setIsInputError,
    handleSearchChange,
    handleShortMoviesChange,
    validateSearchSubmit,
    applyFilter,
    persistSearchState,
  };
}
