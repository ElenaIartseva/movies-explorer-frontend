import './MoviesCard.css';
import { useLocation } from 'react-router-dom';
import { useScreen } from '../../hooks/useScreen.js';
import { MOVIES_IMAGE_BASE } from '../../utils/constants.js';
import { getMovieId } from '../../utils/getMovieId.js';

function MoviesCard(props) {
  const { card, onLikeCard, onDeleteLikeCard, savedCards } = props;

  const { isMobileLayout } = useScreen();
  const { pathname } = useLocation();

  function countTime(duration) {
    const time = duration / 60;
    const hours = Math.floor(time);
    const minutes = duration - hours * 60;

    if (hours && minutes) return `${hours}ч ${minutes}м`;
    return hours ? `${hours}ч` : `${minutes}м`;
  }

  const isLiked = savedCards.some(
    (item) => getMovieId(item) === getMovieId(card)
  );

  const handleLikeCard = () => {
    if (isLiked) {
      onDeleteLikeCard(card);
    } else {
      onLikeCard(card);
    }
  };

  const cardLikeButtonClassName = `movies-card__button ${
    isLiked ? 'movies-card__like' : 'movies-card__dislike'
  }`;

  const cardDeleteButtonClassName = isMobileLayout
    ? 'movies-card__button movies-card__delete'
    : 'movies-card__button movies-card__visible';

  return (
    <li className="movies-card" id={String(getMovieId(card))}>
      <a href={card.trailerLink} target="_blank" rel="noreferrer">
        <img
          className="movies-card__picture"
          src={
            pathname === '/movies'
              ? `${MOVIES_IMAGE_BASE}${card.image.url}`
              : card.image
          }
          alt={`постер фильма ${card.nameRU}`}
        />
      </a>
      <div className="movies-card__name">
        <h6 className="movies-card__title">{card.nameRU}</h6>

        {pathname === '/movies' ? (
          <button
            onClick={handleLikeCard}
            name="button"
            type="button"
            aria-label="Сохранить в избранное или удалить"
            className={cardLikeButtonClassName}
          />
        ) : (
          <button
            onClick={handleLikeCard}
            name="button"
            type="button"
            aria-label="Удалить из избранного"
            className={cardDeleteButtonClassName}
          />
        )}
      </div>
      <p className="movies-card__time">{countTime(card.duration)}</p>
    </li>
  );
}

export { MoviesCard };
