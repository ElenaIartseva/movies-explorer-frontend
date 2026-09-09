import './Login.css';
import '../Register/Register.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../images/logo/logo-smile.svg';
import useValidation from '../../hooks/useValidation.js';
import { login } from '../../utils/MainApi.js';
import { useCurrentUser } from '../../contexts/CurrentUserContext.js';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../utils/constants.js';

function Login() {
  const { setLoggedIn, setCurrentUser, showInfoPopup } = useCurrentUser();
  const [isSending, setIsSending] = useState(false);

  const { errors, isValid, handleChange, resetForm, formValue } =
    useValidation();
  const navigate = useNavigate();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  function handleSubmit(evt) {
    evt.preventDefault();
    handleLogin({
      email: formValue.email,
      password: formValue.password,
    });
  }

  const handleLogin = ({ email, password }) => {
    setIsSending(true);

    return login({ email, password })
      .then((res) => {
        if (res.jwt) {
          setLoggedIn(true);
          localStorage.setItem('jwt', res.jwt);
          navigate('/movies');
          setCurrentUser({
            name: res.name,
            email: res.email,
            _id: res._id,
          });
        }
      })
      .catch((error) => {
        if (error === 401) {
          showInfoPopup('Вы ввели неправильный логин или пароль.');
        } else if (error === 500) {
          showInfoPopup('На сервере произошла ошибка.');
        } else {
          showInfoPopup('Что-то пошло не так! Попробуйте ещё раз.');
        }
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <section className="register login">
      <div className="register__container">
        <Link className="register__link" to="/signin">
          <img
            className="register__logo"
            src={logo}
            alt="белый улыбающийся смайлик на зелёном фоне"
          />
        </Link>
        <h3 className="register__title">Рады видеть!</h3>
        <form
          action="#"
          name="register"
          className="register__form"
          noValidate
          onSubmit={handleSubmit}
        >
          <fieldset className="register__fieldset" disabled={isSending}>
            <label className="register__field">
              <h6 className="register__discription">E-mail</h6>
              <input
                id="login-input-email"
                type="email"
                name="email"
                className="register__input_type_email register__input"
                placeholder="E-mail"
                minLength={NAME_MIN_LENGTH}
                maxLength={NAME_MAX_LENGTH}
                required
                autoComplete="on"
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
                id="password-login-input"
                name="password"
                className="register__input_type_password register__input"
                placeholder="Пароль"
                type="password"
                required
                autoComplete="on"
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
              className={`register__button login__button ${
                !isValid && errors ? 'register__button_disabled' : ''
              }`}
            >
              {isSending ? 'Вход...' : 'Войти'}
            </button>
            <div className="login__register">
              <p className="register__text login__text">
                Ещё не зарегистрированы?
              </p>
              <Link
                className="register__text register__enter login__enter link"
                to="/signup"
              >
                Регистрация
              </Link>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

export { Login };
