import i18next from "i18next";

export function createI18nText(tag: string, key: string) {
  const el = document.createElement(tag);
  el.textContent = i18next.t(key);
  el.setAttribute("data-i18n", key);
  return el;
}
