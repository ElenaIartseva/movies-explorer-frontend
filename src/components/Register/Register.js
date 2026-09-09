import './Register.css';
import { useState, useEffect } from 'react';
import logo from '../../images/logo/logo-smile.svg';
import { Link, useNavigate } from 'react-router-dom';
import useValidation from '../../hooks/useValidation.js';
import { register } from '../../utils/MainApi.js';
import { useCurrentUser } from '../../contexts/CurrentUserContext.js';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../utils/constants.js';

function Register() {
  const { showInfoPopup } = useCurrentUser();
  const [isSending, setIsSending] = useState(false);

  const { errors, isValid, handleChange, resetForm, formValue } =
    useValidation();
  const navigate = useNavigate();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  function handleSubmit(evt) {
    evt.preventDefault();
    handleRegister({
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
    });
  }

  function handleRegister({ name, email, password }) {
    setIsSending(true);

    return register({ name, email, password })
      .then((res) => {
        if (res) {
          navigate('/signin');
          showInfoPopup('Вы успешно зарегистрировались!');
        }
      })
      .catch((error) => {
        if (error === 409) {
          showInfoPopup('Пользователь с таким email уже существует.');
        } else if (error === 500) {
          showInfoPopup('На сервере произошла ошибка.');
        } else {
          showInfoPopup('Что-то пошло не так! Попробуйте ещё раз.');
        }
      })
      .finally(() => {
        setIsSending(false);
      });
  }

  return (
    <section className="register">
      <div className="register__container">
        <Link className="register__link" to="/signin">
          <img
            className="register-logo"
            src={logo}
            alt="белый улыбающийся смайлик на зелёном фоне"
          />
        </Link>
        <h3 className="register__title">Добро пожаловать!</h3>
        <form
          action="#"
          name="register"
          className="register__form"
          noValidate
          onSubmit={handleSubmit}
        >
          <fieldset className="register__fieldset" disabled={isSending}>
            <label className="register__field">
              <h6 className="register__discription">Имя</h6>
              <input
                id="register-input-name"
                type="text"
                name="name"
                className="register__input_type_name register__input"
                placeholder="Имя"
                minLength={NAME_MIN_LENGTH}
                maxLength={NAME_MAX_LENGTH}
                required
                pattern="[A-Za-zА-Яа-я]{2,30}"
                title="Имя должно сост. из не менее чем 2 симв., вкл. только латиницу и кириллицу."
                value={formValue.name || ''}
                onChange={handleChange}
              />
              <span
                className={`register__input-error ${
                  !isValid && errors.name ? 'register__input-error' : ''
                }`}
                id="name-error"
              >
                {errors.name || ''}
              </span>
            </label>
            <label className="register__field">
              <h6 className="register__discription">E-mail</h6>
              <input
                id="register-input-email"
                type="email"
                name="email"
                className="register__input_type_email register__input"
                placeholder="E-mail"
                minLength={NAME_MIN_LENGTH}
                maxLength={NAME_MAX_LENGTH}
                required
                pattern="^.+@.+\..+$"
                title="Поле e-mail должно быть обязательно заполнено."
                value={formValue.email || ''}
                onChange={handleChange}
              />
              <span
                className={`register__input-error ${
                  !isValid && errors.email ? 'register__input-error' : ''
                }`}
                id="email-error"
              >
                {errors.email || ''}
              </span>
            </label>
            <label className="register__field">
              <h6 className="register__discription">Пароль</h6>
              <input
                id="password-register-input"
                name="password"
                className="register__input_type_password register__input"
                placeholder="Пароль"
                type="password"
                required
                pattern={`.{${PASSWORD_MIN_LENGTH},}`}
                title={`Пароль должен состоять из не менее чем ${PASSWORD_MIN_LENGTH} символов.`}
                value={formValue.password || ''}
                onChange={handleChange}
              />
              <span
                className={`register__input-error ${
                  !isValid && errors.password ? 'register__input-error' : ''
                }`}
                id="password-error"
              >
                {errors.password || ''}
              </span>
            </label>
            <button
              name="button"
              type="submit"
              disabled={!isValid || isSending}
              className={`register__button ${
                !isValid && errors ? 'register__button_disabled' : ''
              }`}
            >
              {isSending ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <div className="register__login">
              <p className="register__text">Уже зарегистрированы?</p>
              <Link
                className="register__text register__enter link"
                to="/signin"
              >
                Войти
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

export { Register };
