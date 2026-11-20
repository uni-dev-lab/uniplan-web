import { DEFAULT_LANGUAGE, getStoredLanguage, LANGUAGE_STORAGE_KEY } from './language';

describe('getStoredLanguage', () => {
  afterEach(() => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
  });

  it('should return the default language when nothing is stored', () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    expect(getStoredLanguage()).toBe(DEFAULT_LANGUAGE);
  });

  it('should return a stored supported language', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    expect(getStoredLanguage()).toBe('en');
  });

  it('should fall back to the default language for an unsupported stored value', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');
    expect(getStoredLanguage()).toBe(DEFAULT_LANGUAGE);
  });
});
