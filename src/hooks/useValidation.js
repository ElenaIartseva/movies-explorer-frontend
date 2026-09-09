import { useState, useCallback } from 'react';
import { NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH } from '../utils/constants.js';

export function useValidation() {

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
    search: ''
  })
 
  const handleChange = (evt) => {
    const input = evt.target;
    const value = input.value;
    const name = input.name;

    setFormValue({
      ...formValue,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: input.validationMessage
    });
    if (name === 'name') {
      if (evt.target.validationMessage === 'Введите данные в указанном формате.') {
        setErrors({
          ...errors,
          name: `Имя должно сост. из не менее чем ${NAME_MIN_LENGTH} симв., вкл. только латиницу и кириллицу.`,
        });
      }
    }
    if (name === 'email') {
      if (evt.target.validationMessage === 'Введите данные в указанном формате.') {
        setErrors({
          ...errors,
          email: 'Поле e-mail должно быть обязательно заполнено.',
        });
      }
    }
    if (name === 'password') {
      if (evt.target.validationMessage === 'Введите данные в указанном формате.') {
        setErrors({
          ...errors,
          password: `Пароль должен состоять из не менее чем ${PASSWORD_MIN_LENGTH} символов.`,
        });
      }
    };
    setIsValid(input.closest('form').checkValidity());
  }

  const resetForm = useCallback(
    (
    newValue = {},
    newErrorMessage = {},
    newIsValid = false
    ) => {
      setFormValue(newValue);
      setErrors(newErrorMessage);
      setIsValid(newIsValid);
    },
    [setFormValue, setErrors, setIsValid]
  )

  return { 
    formValue, 
    handleChange, 
    resetForm, 
    errors, 
    isValid, 
    setFormValue,
  };
}

export default useValidation;