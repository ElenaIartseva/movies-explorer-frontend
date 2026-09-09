import './MoviesCardList.css';
import '../Movies/Movies.css';
import { useLocation } from 'react-router-dom';
import { MoviesCard } from '../MoviesCard/MoviesCard.js';

function MoviesCardList(props) {

  const { 
    cards,
    visibleCardsCount, 
    savedCards, 
    onLikeCard, 
    onDelete,
  } = props;
  
  const { pathname } = useLocation();

  return (
    <section className="movies-card-list">
      <ul className="movies-card-list__movies">
    
      {pathname === '/movies' 
        ? (cards.slice(0, visibleCardsCount).map((card) => (
          <MoviesCard 
            key={card.id}
            card={card} 
            onLikeCard={onLikeCard} 
            onDeleteLikeCard={onDelete}
            savedCards={savedCards} 
          /> 
        )))
        
        : (savedCards.slice(0, visibleCardsCount).map((card) => (
          <MoviesCard
            key={card._id}
            card={card} 
            onDeleteLikeCard={onDelete}
            savedCards={savedCards}
          />
        )))
      }
      </ul>
    </section>
  )
};

export { MoviesCardList };