import './Footer.css';
import { useLocation } from 'react-router-dom';

function Footer() {
  const { pathname } = useLocation();

  return (
    <>
      {(pathname === '/movies' || pathname === '/saved-movies') && (
        <footer className='footer'>
          <p className='footer__title'>Учебный проект Яндекс.Практикум х BeatFilm.</p>

          <div className='footer-info'>
            <p className='footer-info__date'>© 2023</p>
            <div className='footer-info__links'>
              <a
                className='footer-info__github link'
                href='https://github.com/ElenaIartseva'
                rel='noreferrer'
                target='_blank'
              >
                Github
              </a>
            </div>
          </div>
        </footer>
      )}
    </>
  )
}

export { Footer };