import { fadeIn, fadeOut } from "./animation";

const fillProperty = "--fill";
const fillSpeed = 1 / 3000;
const emptySpeed = 1 / 750;

interface Props {
  key: string;
  children: HTMLElement[];
  class: string;
  onFill(): void;
}
export default class LongPressButton {
  #el: HTMLButtonElement;
  #onKeydown: (e: KeyboardEvent) => void;
  #onKeyup: (e: KeyboardEvent) => void;
  #filling = false;
  constructor({ key, children, onFill, class: cls }: Props) {
    this.#el = document.createElement("button");
    this.#el.classList.add("positioned-button");
    this.#el.classList.add("long-press");
    this.#el.classList.add(`button-${key}`);
    this.#el.classList.add(cls);
    for (const child of children) {
      this.#el.appendChild(child);
    }
    const tick = () => {
      let fill = +this.#el.style
        .getPropertyValue(fillProperty)
        .replace("%", "");
      if (this.#filling) {
        const change = 100 * ((1000 / 60) * fillSpeed);
        fill = Math.min(100, fill + change);
        fill = Math.max(10, fill);
        this.#el.style.setProperty(fillProperty, `${fill}%`);

        if (fill < 100) {
          requestAnimationFrame(tick);
        } else {
          onFill();
        }
      } else {
        const change = 100 * ((1000 / 60) * emptySpeed);
        fill = Math.max(0, fill - change);
        this.#el.style.setProperty(fillProperty, `${fill}%`);
        if (fill > 0) {
          requestAnimationFrame(tick);
        }
      }
    };
    const onPress = () => {
      this.#filling = true;
      requestAnimationFrame(tick);
    };
    const onRelease = () => {
      // Cancel the fill animation
      this.#filling = false;
    };

    this.#el.onpointerdown = onPress;
    this.#el.onpointerup = onRelease;

    this.#onKeydown = (e) => {
      if (e.key === key) {
        onPress();
      }
    };
    this.#onKeyup = (e) => {
      if (e.key === key) {
        onRelease();
      }
    };
  }

  async show(parent: HTMLElement) {
    await fadeIn(parent, this.#el);
    document.addEventListener("keydown", this.#onKeydown);
    document.addEventListener("keyup", this.#onKeyup);
  }

  async hide() {
    document.removeEventListener("keydown", this.#onKeydown);
    document.removeEventListener("keyup", this.#onKeyup);
    await fadeOut(this.#el.parentElement!, this.#el);
  }
}
