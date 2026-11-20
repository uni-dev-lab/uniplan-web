export const LANGUAGE_STORAGE_KEY = 'lang';
export const DEFAULT_LANGUAGE = 'bg';
export const SUPPORTED_LANGUAGES: readonly string[] = ['bg', 'en'];

export function getStoredLanguage(): string {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
}
