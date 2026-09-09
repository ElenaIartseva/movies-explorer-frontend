export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const PASSWORD_MIN_LENGTH = 8;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 30;

export const MOVIES_API_URL =
  import.meta.env.VITE_MOVIES_API_URL ||
  'https://api.nomoreparties.co/beatfilm-movies';

export const MOVIES_IMAGE_BASE =
  import.meta.env.VITE_MOVIES_IMAGE_BASE ||
  'https://api.nomoreparties.co';

export const MOVIES_API_SETTINGS = {
  baseUrl: MOVIES_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const MAIN_API_SETTINGS = {
  baseUrl: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const SHORT_MOVIE_MINUTES = 40;

export const DESKTOP = 12;
export const TABLET = 12;
export const SMALLTABLET = 8;
export const MOBILE = 5;

export const DESKTOP_ADD = 4;
export const TABLET_ADD = 3;
export const MOBILE_ADD = 2;

export const isDesktopMin = 1237;
export const isTabletMin = 970;
export const isTabletMax = 1236;
export const isSmallTabletMin = 729;
export const isSmallTabletMax = 969;
export const isMobileMin = 320;
export const isMobileMax = 728;
export const isMobileLayoutMax = 768;
export const isCompactSearchMax = 525;
