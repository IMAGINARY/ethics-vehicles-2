import { fadeIn, fadeOut } from "./animation";
import { createI18nText } from "./i18n";

interface ListOption {
  key: string;
  handler(): void;
}

export default class Options {
  #parent: HTMLElement;
  #el: HTMLElement;
  #buttons: HTMLButtonElement[];
  #handleKeydown: (e: KeyboardEvent) => void;

  constructor(parent: HTMLElement, options: ListOption[]) {
    this.#parent = parent;
    const list = document.createElement("div");
    list.classList.add("options");
    this.#buttons = [];
    for (const { key, handler } of options) {
      const button = createI18nText("button", key) as HTMLButtonElement;
      list.append(button);
      button.onclick = handler;
      this.#buttons.push(button);
    }
    this.#el = list;
    this.#handleKeydown = (e) => {
      e.preventDefault();
      switch (e.key) {
        case "1": {
          this.#buttons[0].click();
          return;
        }
        case "2": {
          this.#buttons[1].click();
          return;
        }
        case "3": {
          this.#buttons[2].click();
          return;
        }
      }
    };
  }

  async show() {
    await fadeIn(this.#parent, this.#el);
    document.addEventListener("keydown", this.#handleKeydown);
  }

  async hide() {
    document.removeEventListener("keydown", this.#handleKeydown);
    await fadeOut(this.#parent, this.#el);
  }
}
