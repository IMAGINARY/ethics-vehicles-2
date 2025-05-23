import { animateIn, animateOut, delay } from "../animation";
import { createI18nText } from "../i18n";
import styles from "./style.module.css";

export default class IdleMessages {
  #animating = false;
  #container: HTMLElement | undefined;
  #currentMsg: number;
  constructor() {
    this.#currentMsg = 0;
  }

  async show(parent: HTMLElement) {
    this.#animating = true;
    this.#container = document.createElement("div");
    parent.appendChild(this.#container);
    while (this.#animating) {
      const msg = this.createMsg();
      await animateIn(this.#container, msg, {
        animation: "scaleIn",
        duration: 750,
      });
      await delay(5000);
      await animateOut(msg, { animation: "scaleOut", duration: 750 });
      this.toggleMsg();
      await delay(1000);
    }
  }

  createMsg() {
    const index = this.#currentMsg + 1;
    const msg = createI18nText("div", `Idle${index}`);
    msg.classList.add(styles.idleMessage);
    msg.classList.add(styles[`msg${index}`]);
    return msg;
  }

  toggleMsg() {
    this.#currentMsg = (this.#currentMsg + 1) % 2;
  }

  async hide() {
    this.#animating = false;
    animateOut(this.#container!);
  }
}
