export const SUPPORTED_LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇧🇴' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'qu', label: 'Qhichwa', flag: '🇧🇴' }
] as const;

export const DEFAULT_LANGUAGE = 'es';

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export function resolveLanguage(language: string | null): SupportedLanguageCode {
  return SUPPORTED_LANGUAGES.some(item => item.code === language)
    ? language as SupportedLanguageCode
    : DEFAULT_LANGUAGE;
}
