[![Обложка к видео «movies-explorer-frontend»](./src/images/movies-explorer-frontend.jpg)](https://youtu.be/FbWmu8DHu70)

# movies-explorer-frontend

Фронтенд сервиса, в котором можно найти фильмы по запросу и сохранить в личном кабинете

## Функционал

- Регистрация и авторизация пользователя
- Редактирование профиля
- Поиск фильмов с фильтром «короткометражки»
- Сохранение и удаление фильмов в личном кабинете
- Поиск по сохранённым фильмам

## Стек технологий

- HTML5, CSS3
- JavaScript (ES modules)
- React 18
- React Router 6
- Vite 5
- Vitest, React Testing Library
- ESLint, Prettier

## Архитектура проекта

```
src/
├── components/          # UI-компоненты (App, Movies, Profile, Login и др.)
├── contexts/
│   └── CurrentUserContext.js   # контекст пользователя и авторизации
├── hooks/
│   ├── useMoviesFilter.js      # поиск и фильтрация фильмов
│   ├── useScreen.js            # адаптивные breakpoints
│   └── useValidation.js        # валидация форм
├── utils/
│   ├── api.js                  # единый API-слой (MainApi + MoviesApi)
│   ├── getMovieId.js           # id Beatfilm / movieId сохранённого фильма
│   ├── filterMovies.js         # чистая функция фильтрации
│   └── constants.js            # URL, breakpoints, env-переменные
└── test-utils.jsx              # хелперы для тестов
```

### API (`src/utils/api.js`)

Единый слой для работы с бэкендом и API фильмов:

- **`mainApi`** — регистрация, вход, профиль, сохранённые фильмы
- **`moviesApi`** — каталог фильмов Beat Film
- **Глобальная обработка 401** — при истечении JWT сессия сбрасывается, пользователь перенаправляется на `/signin`

Файлы `MainApi.js` и `MoviesApi.js` re-export методы из `api.js` для обратной совместимости.

### Контекст (`CurrentUserContext`)

Хук `useCurrentUser()` предоставляет:

- `currentUser`, `setCurrentUser` — данные профиля
- `loggedIn`, `setLoggedIn` — состояние авторизации
- `showInfoPopup(text)` — показ модального уведомления
- `clearSessionData()` — очистка JWT и localStorage

Используется в Login, Register, Profile, Header и ProtectedRoute.

### Тесты

19 тестов (Vitest):

- `filterMovies.test.js` — фильтрация по названию и длительности
- `getMovieId.test.js` — id каталога и сохранённого фильма
- `useValidation.test.js` — валидация форм
- `Login.test.jsx` — сценарии входа
- `Profile.test.jsx` — редактирование профиля
- `ProtectedRoute.test.jsx` — защищённые маршруты
- `InfoPopup.test.jsx` — модальное окно и доступность

## Запуск проекта

### Требования

- Node.js 18+
- npm 9+

### Установка

```bash
git clone https://github.com/ElenaIartseva/movies-explorer-frontend.git
cd movies-explorer-frontend
npm install
```

### Переменные окружения

Скопируйте `.env.example` в `.env` и при необходимости измените значения:

```bash
cp .env.example .env
```

| Переменная | Описание |
|------------|----------|
| `VITE_API_URL` | URL бэкенда (`http://localhost:3000` для локальной разработки) |
| `VITE_MOVIES_API_URL` | URL API фильмов |
| `VITE_MOVIES_IMAGE_BASE` | Базовый URL для постеров |
| `DEPLOY_USER` | Пользователь для деплоя (опционально) |
| `DEPLOY_HOST` | Хост для деплоя (опционально) |
| `DEPLOY_PATH` | Путь на сервере для деплоя (опционально) |

### Команды

| Команда | Описание |
|---------|----------|
| `npm start` | Dev-сервер (Vite) — http://localhost:5173 |
| `npm run dev` | То же, что `npm start` |
| `npm run build` | Production-сборка в `dist/` |
| `npm run preview` | Просмотр production-сборки локально |
| `npm run test` | Запуск тестов (Vitest) |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run lint` | Проверка ESLint |
| `npm run lint:fix` | Автоисправление ESLint |
| `npm run format` | Форматирование Prettier |
| `npm run deploy` | Сборка и деплой (нужны `DEPLOY_*`) |

## Ссылки

Backend: https://github.com/ElenaIartseva/movies-explorer-api

---

# movies-explorer-frontend (EN)

Frontend service for searching movies and saving them to a personal account.

**Stack:** HTML5, CSS3, JavaScript, React 18, React Router 6, Vite 5, Vitest, ESLint, Prettier.

**Architecture:** unified API layer (`src/utils/api.js`), user context (`useCurrentUser`), shared hooks for filtering and responsive layout. 19 tests.

## Quick start

```bash
npm install
cp .env.example .env
npm start
```

## Scripts

- `npm start` — development server (Vite)
- `npm run build` — production build to `dist/`
- `npm run test` — run tests
- `npm run lint` — lint code
- `npm run format` — format with Prettier

## Links

Backend: https://github.com/ElenaIartseva/movies-explorer-api
