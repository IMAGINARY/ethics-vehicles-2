import en from "./locales/en.json";
import de from "./locales/de.json";

const I18N_ATTR = "data-i18n";

const strings = { en, de };
let currentLang: keyof typeof strings = "en";

export function createI18nText(tag: string, key: string) {
  const el = document.createElement(tag);
  el.textContent = translate(key);
  el.setAttribute(I18N_ATTR, key);
  return el;
}

export function refreshI18nText() {
  for (const el of document.querySelectorAll(`[${I18N_ATTR}]`)) {
    const key = el.getAttribute(I18N_ATTR) ?? "";
    el.textContent = translate(key);
  }
}

export function getCurrentLang() {
  return currentLang;
}

export function changeLanguage(newLang: string) {
  if (!Object.keys(strings).includes(newLang)) {
    throw new Error(`Unknown code: ${newLang}`);
  }
  currentLang = newLang as any;
}

function translate(key: string) {
  return getNestedKey(strings[currentLang], key.split("."));
}

function getNestedKey(object: Record<string, any>, path: string[]) {
  const [head, ...tail] = path;
  const value = object[head];
  if (tail.length === 0) {
    return value;
  }
  if (value == null) {
    return undefined;
  }
  return getNestedKey(value, tail);
}
