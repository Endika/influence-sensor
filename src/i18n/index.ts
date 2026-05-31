import { ca } from './locales/ca'
import { en } from './locales/en'
import { es } from './locales/es'
import { eu } from './locales/eu'
import { gl } from './locales/gl'
import { va } from './locales/va'

type Dict = Record<string, string>

export const LOCALES: Array<{ code: string; label: string; dict: Dict }> = [
  { code: 'en', label: 'English', dict: en },
  { code: 'es', label: 'Español', dict: es },
  { code: 'ca', label: 'Català', dict: ca },
  { code: 'gl', label: 'Galego', dict: gl },
  { code: 'eu', label: 'Euskara', dict: eu },
  { code: 'va', label: 'Valencià', dict: va },
]

const byCode = (code: string) => LOCALES.find((l) => l.code === code)

let current = 'en'

/** Pick the best locale from the browser, falling back to English. */
export function detectLocale(): string {
  const lang = (navigator.language || 'en').slice(0, 2).toLowerCase()
  return byCode(lang) ? lang : 'en'
}

export function setLocale(code: string): void {
  if (byCode(code)) current = code
}

export function getLocale(): string {
  return current
}

/** Translate a key for the current locale, substituting {placeholders}. */
export function t(key: string, params?: Record<string, string | number>): string {
  let s = byCode(current)?.dict[key] ?? en[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) s = s.split(`{${k}}`).join(String(v))
  }
  return s
}
