import './InfoPopup.css';
import { useEffect, useId, useRef } from 'react';

function InfoPopup(props) {
  const { title, isOpen, onSubmit } = props;
  const titleId = useId();
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    buttonRef.current?.focus();

    const handleKeyDown = (evt) => {
      if (evt.key === 'Escape') {
        onSubmit();
        return;
      }

      if (evt.key !== 'Tab' || !popupRef.current) {
        return;
      }

      const focusable = popupRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (evt.shiftKey && document.activeElement === first) {
        evt.preventDefault();
        last.focus();
      } else if (!evt.shiftKey && document.activeElement === last) {
        evt.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSubmit]);

  const handleOverlayClick = () => {
    onSubmit();
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit();
  };

  const handleContainerClick = (evt) => {
    evt.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="info-popup info-popup_opened"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <form
        ref={popupRef}
        className="info-popup__container"
        onSubmit={handleSubmit}
        onClick={handleContainerClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 className="info-popup__title" id={titleId}>
          {title}
        </h2>
        <button ref={buttonRef} type="submit" className="info-popup__button">
          ОК
        </button>
      </form>
    </div>
  );
}

export { InfoPopup };
