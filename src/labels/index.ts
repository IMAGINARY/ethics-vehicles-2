import { animateIn } from "../animation";
import { Label } from "../config";
import { createI18nText } from "../i18n";
import styles from "./style.module.css";

export async function createLabel(
  key: string,
  { position, color, align, width }: Label
) {
  const labelContainer = document.getElementById("labels")!;

  const labelEl = document.createElement("div");
  labelEl.classList.add(styles.label);
  labelEl.style.left = `${position[0]}px`;
  labelEl.style.top = `${position[1]}px`;
  labelEl.style.color = color ?? "white";
  labelEl.style.textAlign = align ?? "left";
  if (width) {
    labelEl.style.width = `${width}px`;
  }
  const name = createI18nText("div", `${key}.name`);
  name.classList.add(styles.labelName);
  labelEl.append(name);
  labelEl.append(createI18nText("div", `${key}.description`));
  await animateIn(labelContainer, labelEl, { duration: 750 });
}
