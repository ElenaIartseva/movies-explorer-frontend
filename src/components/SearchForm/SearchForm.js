import './SearchForm.css';
import icon from '../../images/search_icon.svg';
import { FilterCheckbox } from '../FilterCheckbox/FilterCheckbox';
import { useScreen } from '../../hooks/useScreen.js';

function SearchForm(props) {
  const {
    onSubmit,
    onChange,
    value,
    checked,
    onCheckboxChange,
    isError,
    isSending,
  } = props;

  const { isCompactSearch } = useScreen();

  return (
    <section className="search-form">
      <div className="search-form__container">
        <form className="search-form__find" onSubmit={onSubmit} noValidate>
          <fieldset className="search-form__fieldset" disabled={isSending}>
            <label className="search-form__field">
              {!isCompactSearch && (
                <img
                  className="search-form__icon"
                  src={icon}
                  alt="маленькая серая лупа"
                />
              )}

              <input
                id="search-form-input"
                type="text"
                name="search"
                className="search-form__input"
                placeholder="Фильм"
                minLength={2}
                maxLength={30}
                value={value}
                onChange={onChange}
              />
              <span className="search-form__input-error" />
            </label>

            <button
              name="button"
              type="submit"
              className="button search-form__button"
              disabled={isSending}
            >
              Найти
            </button>

            {isError && (
              <span className="search-form__error">
                Нужно ввести ключевое слово
              </span>
            )}
          </fieldset>
        </form>
        <FilterCheckbox checked={checked} onChange={onCheckboxChange} />
      </div>
    </section>
  );
}

export { SearchForm };
