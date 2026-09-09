import { SHORT_MOVIE_MINUTES } from './constants.js';

export function filterMoviesByQuery(movies, searchQuery, isShortMovie) {
  const query = searchQuery.toLowerCase();

  let filtered = movies.filter((movie) => {
    const movieTitleRU = movie.nameRU.toLowerCase();
    const movieTitleEN = movie.nameEN.toLowerCase();
    return movieTitleRU.includes(query) || movieTitleEN.includes(query);
  });

  if (isShortMovie) {
    filtered = filtered.filter((movie) => movie.duration <= SHORT_MOVIE_MINUTES);
  }

  return filtered;
}
