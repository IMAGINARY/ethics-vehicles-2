interface ListOption {
  text: string;
  handler(): void;
}

export default class Options {
  #parent: HTMLElement;
  #el: HTMLElement;
  #buttons: HTMLButtonElement[];
  #selected: number = 0;
  #keypressHandler: (e: KeyboardEvent) => void;

  constructor(parent: HTMLElement, prompt: string, options: ListOption[]) {
    this.#parent = parent;
    const list = document.createElement("div");
    list.classList.add("options");
    list.innerHTML = `<h2>${prompt}</h2>`;
    this.#buttons = [];
    for (const { text, handler } of options) {
      const button = document.createElement("button");
      button.textContent = text;
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
        case "SpaceBar":
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

  show() {
    this.#parent.appendChild(this.#el);
    document.addEventListener("keydown", this.#keypressHandler);
  }

  hide() {
    document.removeEventListener("keydown", this.#keypressHandler);
    this.#parent.removeChild(this.#el);
  }
}
