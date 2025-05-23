import styles from "./style.module.css";

interface AnimationProps {
  animation?: string;
  duration?: number;
}

export function animateIn(
  parent: HTMLElement,
  child: HTMLElement,
  { animation = "fadeIn", duration = 500 }: AnimationProps = {}
): Promise<void> {
  child.style.animationName = styles[animation];
  child.style.animationDuration = `${duration}ms`;
  parent.appendChild(child);
  return new Promise((resolve) => {
    child.onanimationend = () => {
      resolve();
    };
  });
}

export function animateOut(
  child: HTMLElement,
  { animation = "fadeOut", duration = 500 }: AnimationProps = {}
): Promise<void> {
  child.style.animationDuration = `${duration}ms`;
  child.style.animationName = styles[animation];
  return new Promise((resolve) => {
    child.onanimationend = () => {
      child.parentElement!.removeChild(child);
      resolve();
    };
  });
}

// Execute the events waiting the provided interval between each one.
// Resolve when all events have finished.
export async function stagger(
  events: (() => Promise<void>)[],
  interval: number
) {
  await Promise.all(
    events.map(async (event, i) => {
      await delay(i * interval);
      await event();
    })
  );
}

export function delay(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
