import { describe, it, expect } from 'vitest';
import { filterMoviesByQuery } from './filterMovies.js';

const movies = [
  { nameRU: 'Матрица', nameEN: 'The Matrix', duration: 136 },
  { nameRU: 'Короткометражка', nameEN: 'Short Film', duration: 30 },
  { nameRU: 'Начало', nameEN: 'Inception', duration: 148 },
];

describe('filterMoviesByQuery', () => {
  it('фильтрует по русскому названию', () => {
    const result = filterMoviesByQuery(movies, 'матри', false);
    expect(result).toHaveLength(1);
    expect(result[0].nameRU).toBe('Матрица');
  });

  it('фильтрует по английскому названию', () => {
    const result = filterMoviesByQuery(movies, 'inception', false);
    expect(result).toHaveLength(1);
    expect(result[0].nameEN).toBe('Inception');
  });

  it('оставляет только короткометражки', () => {
    const result = filterMoviesByQuery(movies, '', true);
    expect(result).toHaveLength(1);
    expect(result[0].duration).toBeLessThanOrEqual(40);
  });

  it('возвращает пустой массив при отсутствии совпадений', () => {
    const result = filterMoviesByQuery(movies, 'xyz', false);
    expect(result).toHaveLength(0);
  });
});
