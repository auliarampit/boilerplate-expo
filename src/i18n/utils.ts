import i18n from './i18n'

export function getTranslation(key: string): string {
  return i18n.t(key)
}
