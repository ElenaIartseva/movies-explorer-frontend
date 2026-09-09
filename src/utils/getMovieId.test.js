import { describe, it, expect } from 'vitest';
import { getMovieId } from './getMovieId.js';

describe('getMovieId', () => {
  it('берёт movieId у сохранённого фильма', () => {
    expect(getMovieId({ movieId: 42, id: 'mongo-id' })).toBe(42);
  });

  it('берёт id у фильма из Beatfilm', () => {
    expect(getMovieId({ id: 7 })).toBe(7);
  });
});
