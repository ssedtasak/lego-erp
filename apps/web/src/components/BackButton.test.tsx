import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackButton from './BackButton';
import { RouterContext } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  RouterContext: require('@testing-library/react').RouterContext,
}));

describe('BackButton', () => {
  it('renders with default text', () => {
    render(<BackButton />);
    expect(screen.getByText('← กลับ')).toBeTruthy();
  });

  it('renders with custom text', () => {
    render(<BackButton>Custom Back</BackButton>);
    expect(screen.getByText('Custom Back')).toBeTruthy();
  });

  it('is a link element', () => {
    render(<BackButton href="/custom" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/custom');
  });
});
