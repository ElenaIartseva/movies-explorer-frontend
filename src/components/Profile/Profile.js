import './Profile.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useValidation from '../../hooks/useValidation.js';
import { userInformation } from '../../utils/MainApi.js';
import { useCurrentUser } from '../../contexts/CurrentUserContext.js';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
} from '../../utils/constants.js';

function Profile() {
  const {
    currentUser,
    setCurrentUser,
    setLoggedIn,
    showInfoPopup,
    clearSessionData,
  } = useCurrentUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { errors, isValid, handleChange, resetForm, formValue } =
    useValidation();
  const navigate = useNavigate();

  const isDataChanged =
    formValue.name !== currentUser.name ||
    formValue.email !== currentUser.email;

  useEffect(() => {
    resetForm({
      name: currentUser.name,
      email: currentUser.email,
    });
  }, [resetForm, currentUser.name, currentUser.email]);

  function handleSubmit(evt) {
    evt.preventDefault();
    handleUpdateUser({
      name: formValue.name,
      email: formValue.email,
    });
  }

  const handleUpdateUser = ({ name, email }) => {
    setIsLoading(true);
    setIsSending(true);

    userInformation({ name, email })
      .then(({ name: updatedName, email: updatedEmail }) => {
        setCurrentUser({ ...currentUser, name: updatedName, email: updatedEmail });
        setIsEditing(false);
        showInfoPopup('Данные успешно отредактированы!');
      })
      .catch((error) => {
        if (error === 409) {
          showInfoPopup('Пользователь с таким email уже существует.');
        } else if (error === 500) {
          showInfoPopup('На сервере произошла ошибка.');
        } else if (error !== 401) {
          showInfoPopup('Что-то пошло не так! Попробуйте ещё раз.');
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsSending(false);
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSignout = () => {
    clearSessionData();
    setLoggedIn(false);
    setCurrentUser({});
    navigate('/signin');
  };

  return (
    <section className="profile">
      <div className="profile__container">
        <h3 className="profile__title">Привет, {currentUser.name}!</h3>
        <form
          className="form profile__form"
          name="profile"
          onSubmit={handleSubmit}
          noValidate
        >
          <fieldset className="profile__fieldset" disabled={isSending}>
            <div className="profile__field">
              <label className="profile__input-tittle">Имя</label>

              {isEditing ? (
                <input
                  id="profile-input-name"
                  type="text"
                  name="name"
                  className="profile__input_type_name profile__input"
                  minLength={NAME_MIN_LENGTH}
                  maxLength={NAME_MAX_LENGTH}
                  required
                  placeholder="Имя"
                  value={formValue.name || ''}
                  onChange={handleChange}
                  pattern="[A-Za-zА-Яа-я]{2,30}"
                  title="Имя должно сост. из не менее чем 2 симв., вкл.только латиницу и кириллицу."
                />
              ) : (
                <p className="profile__input_type_text">{currentUser.name}</p>
              )}
              <span
                className={`profile__input-error ${
                  !isValid && errors.name ? 'profile__input-error' : ''
                }`}
                id="name-error"
              >
                {errors.name || ''}
              </span>
            </div>
            <div className="profile__field">
              <label className="profile__input-tittle profile__input-tittle_type_email">
                E-mail
              </label>

              {isEditing ? (
                <input
                  id="profile-input-email"
                  type="email"
                  name="email"
                  className="profile__input_type_email profile__input"
                  placeholder="E-mail"
                  minLength={NAME_MIN_LENGTH}
                  maxLength={NAME_MAX_LENGTH}
                  required
                  value={formValue.email || ''}
                  onChange={handleChange}
                  pattern="^.+@.+\..+$"
                  title="Поле e-mail должно быть обязательно заполнено."
                />
              ) : (
                <p className="profile__input_type_text">{currentUser.email}</p>
              )}
              <span
                className={`profile__input-error ${
                  !isValid && errors.email ? 'profile__input-error' : ''
                }`}
                id="email-error"
              >
                {errors.email || ''}
              </span>
            </div>

            <div className="profile__container-button">
              {isEditing ? (
                <button
                  className="button profile__save-button"
                  type="submit"
                  aria-label="Сохранение данных профиля"
                  disabled={!isValid || !isDataChanged || isSending}
                >
                  {isLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
              ) : (
                <>
                  <button
                    className="button profile__registration"
                    type="button"
                    aria-label="Редактирование данных профиля"
                    onClick={handleEditClick}
                  >
                    Редактировать
                  </button>
                  <Link
                    className="profile__logout link"
                    to="/signin"
                    aria-label="Выход из личного кабинета пользователя"
                    onClick={handleSignout}
                  >
                    Выйти из аккаунта
                  </Link>
                </>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

export { Profile };
