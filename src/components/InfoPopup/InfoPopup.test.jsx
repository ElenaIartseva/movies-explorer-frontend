import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InfoPopup } from './InfoPopup.js';

describe('InfoPopup', () => {
  it('закрывается по Escape', () => {
    const onSubmit = vi.fn();

    render(<InfoPopup isOpen title="Тестовое сообщение" onSubmit={onSubmit} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('закрывается по клику на overlay', () => {
    const onSubmit = vi.fn();

    render(<InfoPopup isOpen title="Тестовое сообщение" onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('presentation'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('не закрывается при клике на содержимое popup', () => {
    const onSubmit = vi.fn();

    render(<InfoPopup isOpen title="Тестовое сообщение" onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Тестовое сообщение'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('имеет role dialog и aria-modal', () => {
    render(
      <InfoPopup isOpen title="Тестовое сообщение" onSubmit={() => {}} />
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
