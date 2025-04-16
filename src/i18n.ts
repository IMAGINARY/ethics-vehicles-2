import i18next from "i18next";

const I18N_ATTR = "data-i18n";

export function createI18nText(tag: string, key: string) {
  const el = document.createElement(tag);
  el.textContent = i18next.t(key);
  el.setAttribute(I18N_ATTR, key);
  return el;
}

export function refreshI18nText() {
  for (const el of document.querySelectorAll(`[${I18N_ATTR}]`)) {
    const key = el.getAttribute(I18N_ATTR) ?? "";
    el.textContent = i18next.t(key);
  }
}
