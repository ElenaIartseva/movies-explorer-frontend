import { API_URL, MOVIES_API_URL, MOVIES_IMAGE_BASE } from './constants.js';
import { getMovieId } from './getMovieId.js';

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

class ApiClient {
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }

    if (res.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(res.status);
  }

  _getAuthHeaders(token) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || localStorage.getItem('jwt')}`,
    };
  }

  _request(path, { method = 'GET', token, body, auth = false } = {}) {
    const headers = auth
      ? this._getAuthHeaders(token)
      : {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };

    return fetch(`${this._baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }).then((res) => this._handleResponse(res));
  }
}

class MainApi extends ApiClient {
  constructor() {
    super(API_URL);
  }

  register({ name, email, password }) {
    return this._request('/signup', {
      method: 'POST',
      body: { name, email, password },
    });
  }

  login({ email, password }) {
    return this._request('/signin', {
      method: 'POST',
      body: { email, password },
    });
  }

  getUserInfo(token) {
    return this._request('/users/me', { auth: true, token });
  }

  updateProfile({ name, email }, token) {
    return this._request('/users/me', {
      method: 'PATCH',
      auth: true,
      token,
      body: { name, email },
    });
  }

  getSavedMovies(token) {
    return this._request('/movies', { auth: true, token });
  }

  saveMovie(card, token) {
    return this._request('/movies', {
      method: 'POST',
      auth: true,
      token,
      body: {
        country: card.country,
        director: card.director,
        duration: card.duration,
        description: card.description,
        year: card.year,
        image: `${MOVIES_IMAGE_BASE}${card.image.url}`,
        trailerLink: card.trailerLink,
        thumbnail: `${MOVIES_IMAGE_BASE}${card.image.formats.thumbnail.url}`,
        nameRU: card.nameRU,
        nameEN: card.nameEN,
        movieId: getMovieId(card),
      },
    });
  }

  deleteMovie(cardId, token) {
    return this._request(`/movies/${cardId}`, {
      method: 'DELETE',
      auth: true,
      token,
    });
  }
}

class MoviesApi extends ApiClient {
  constructor() {
    super(MOVIES_API_URL);
  }

  getMovies() {
    return this._request('');
  }
}

export const mainApi = new MainApi();
export const moviesApi = new MoviesApi();

export const baseURL = API_URL;
export const register = (data) => mainApi.register(data);
export const login = (data) => mainApi.login(data);
export const getUserIDInfo = (token) => mainApi.getUserInfo(token);
export const userInformation = (data, token) => mainApi.updateProfile(data, token);
export const getSavedMovies = (token) => mainApi.getSavedMovies(token);
export const saveCard = (card, token) => mainApi.saveMovie(card, token);
export const deleteCard = (cardId, token) => mainApi.deleteMovie(cardId, token);
