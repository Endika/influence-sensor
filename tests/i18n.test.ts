import { afterEach, describe, expect, it } from 'vitest';
import { getLocale, LOCALES, setLocale, t } from '../src/i18n';

afterEach(() => setLocale('en'));

describe('i18n', () => {
  it('ships the six expected locales', () => {
    expect(LOCALES.map((l) => l.code)).toEqual(['en', 'es', 'ca', 'gl', 'eu', 'va']);
  });

  it('substitutes placeholders', () => {
    setLocale('en');
    expect(t('dead.bar', { n: 5, total: 10 })).toBe(
      '5 of 10 you follow get none of your attention',
    );
  });

  it('switches the active locale', () => {
    setLocale('es');
    expect(getLocale()).toBe('es');
    expect(t('verdict.title')).toBe('Salud de la red');
  });

  it('falls back to the key for unknown keys', () => {
    expect(t('nope.missing')).toBe('nope.missing');
  });

  it('ignores unknown locale codes', () => {
    setLocale('xx');
    expect(getLocale()).toBe('en');
  });
});
