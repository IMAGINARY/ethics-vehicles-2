import { animateIn, animateOut } from "../animation";
import { createI18nText } from "../i18n";
import styles from "./style.module.css";

interface ButtonProps {
  // Call on keydown or click
  onPress(): void;
  children?: HTMLElement[];
  // i18n key of the button's text
  i18nKey?: string;
  // Key to press to trigger the button
  key: string;
  // CSS class
  class: string;
}
export function createButton({
  class: cls,
  key,
  i18nKey,
  children,
  onPress,
}: ButtonProps) {
  let button: HTMLButtonElement;
  if (i18nKey) {
    button = createI18nText("button", i18nKey) as HTMLButtonElement;
  } else {
    button = document.createElement("button");
    for (const child of children || []) {
      button.appendChild(child);
    }
  }
  button.classList.add(cls);
  button.classList.add(styles.positionedButton);
  button.classList.add(styles[`button-${key}`]);
  button.onclick = () => {
    button.ontransitionend = () => {
      onPress();
    };
    button.classList.add(styles.pressed);
  };

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === key) {
      button.click();
    }
  }

  return {
    async show(parent: HTMLElement) {
      await animateIn(parent, button);
      document.addEventListener("keydown", handleKeydown);
    },
    async hide() {
      await animateOut(button);
      document.removeEventListener("keydown", handleKeydown);
    },
  };
}
