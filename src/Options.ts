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
  #selected: number = 0;
  #keypressHandler: (e: KeyboardEvent) => void;

  constructor(parent: HTMLElement, promptKey: string, options: ListOption[]) {
    this.#parent = parent;
    const list = document.createElement("div");
    list.classList.add("options");
    list.append(createI18nText("h2", promptKey));
    this.#buttons = [];
    for (const { key, handler } of options) {
      const button = createI18nText("button", key) as HTMLButtonElement;
      list.append(button);
      button.onclick = handler;
      this.#buttons.push(button);
    }
    this.setSelected(this.#selected);
    this.#el = list;
    this.#keypressHandler = (e) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowUp": {
          this.#selected -= 1;
          if (this.#selected < 0) {
            this.#selected += this.#buttons.length;
          }
          this.setSelected(this.#selected);
          break;
        }
        case "ArrowDown": {
          this.#selected = (this.#selected + 1) % this.#buttons.length;
          this.setSelected(this.#selected);
          break;
        }
        case " ":
        case "Enter": {
          this.#buttons[this.#selected].click();
          break;
        }
      }
    };
  }

  setSelected(index: number) {
    for (let i = 0; i < this.#buttons.length; i++) {
      const button = this.#buttons[i];
      if (i === index) {
        button.classList.add("selected");
      } else {
        button.classList.remove("selected");
      }
    }
  }

  async show() {
    await fadeIn(this.#parent, this.#el);
    document.addEventListener("keydown", this.#keypressHandler);
  }

  async hide() {
    document.removeEventListener("keydown", this.#keypressHandler);
    await fadeOut(this.#parent, this.#el);
  }
}
