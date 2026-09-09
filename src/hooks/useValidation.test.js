import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useValidation } from './useValidation.js';

function ValidationForm() {
  const { formValue, handleChange, errors, isValid, resetForm } =
    useValidation();

  return (
    <form data-testid="form">
      <input
        name="email"
        value={formValue.email || ''}
        onChange={handleChange}
        pattern="^.+@.+\..+$"
        required
      />
      <input
        name="password"
        value={formValue.password || ''}
        onChange={handleChange}
        pattern=".{8,}"
        required
      />
      <span data-testid="email-error">{errors.email || ''}</span>
      <span data-testid="valid">{String(isValid)}</span>
      <button type="button" onClick={() => resetForm()}>
        reset
      </button>
    </form>
  );
}

describe('useValidation', () => {
  it('сбрасывает форму через resetForm', () => {
    render(<ValidationForm />);

    fireEvent.change(document.querySelector('input[name="email"]'), {
      target: { name: 'email', value: 'user@mail.ru' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'reset' }));

    expect(screen.getByTestId('valid').textContent).toBe('false');
  });

  it('валидирует корректный email и пароль', () => {
    render(<ValidationForm />);

    fireEvent.change(document.querySelector('input[name="email"]'), {
      target: { name: 'email', value: 'user@mail.ru' },
    });

    fireEvent.change(document.querySelector('input[name="password"]'), {
      target: { name: 'password', value: 'password123' },
    });

    expect(screen.getByTestId('valid').textContent).toBe('true');
  });

  it('показывает кастомную ошибку email', () => {
    render(<ValidationForm />);

    const input = document.querySelector('input[name="email"]');
    Object.defineProperty(input, 'validationMessage', {
      configurable: true,
      get: () => 'Введите данные в указанном формате.',
    });

    fireEvent.change(input, {
      target: { name: 'email', value: 'bad' },
    });

    expect(screen.getByTestId('email-error').textContent).toContain('e-mail');
  });
});
