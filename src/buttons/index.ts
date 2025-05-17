import { fadeIn, fadeOut } from "../animation";
import { createI18nText } from "../i18n";
import styles from "./style.module.css";

export { default as LongPressButton } from "./LongPressButton";

interface ButtonProps {
  // Call on keydown or click
  onPress(): void;
  // i18n key of the button's text
  i18nKey: string;
  // Key to press to trigger the button
  key: string;
  // CSS class
  class: string;
}
export function createButton({
  class: cls,
  key,
  i18nKey,
  onPress,
}: ButtonProps) {
  const button = createI18nText("button", i18nKey);
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
      await fadeIn(parent, button);
      document.addEventListener("keydown", handleKeydown);
    },
    async hide() {
      await fadeOut(button.parentElement!, button);
      document.removeEventListener("keydown", handleKeydown);
    },
  };
}
