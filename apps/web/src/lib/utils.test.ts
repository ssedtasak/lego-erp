import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, cn } from './utils';

describe('formatCurrency', () => {
  it('formats THB correctly', () => {
    expect(formatCurrency(100)).toContain('100');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });
});

describe('formatDate', () => {
  it('formats date string in Thai locale', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('มกราคม'); // Contains Thai month
    expect(result).toContain('2567'); // Buddhist calendar year
  });

  it('handles Date object', () => {
    const result = formatDate(new Date('2024-01-15'));
    expect(result).toContain('มกราคม');
  });
});

describe('formatDateTime', () => {
  it('formats datetime with time', () => {
    const result = formatDateTime('2024-01-15T10:30:00');
    expect(result).toContain('ม.ค.'); // Thai short month
    expect(result).toContain(':'); // Time separator
  });
});

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters falsy values', () => {
    expect(cn('foo', undefined, 'bar', null, false)).toBe('foo bar');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });
});
