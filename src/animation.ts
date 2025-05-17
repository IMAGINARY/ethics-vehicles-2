export function fadeIn(
  parent: HTMLElement,
  child: HTMLElement,
  duration: number = 500
): Promise<void> {
  child.classList.add("fade");
  child.classList.add("invisible");
  child.style.transitionDuration = `${duration}ms`;
  parent.appendChild(child);
  return new Promise((resolve) => {
    child.ontransitionend = () => {
      child.classList.remove("fade");
      resolve();
    };
    setTimeout(() => {
      child.classList.remove("invisible");
    }, 1);
  });
}

export function fadeOut(
  parent: HTMLElement,
  child: HTMLElement,
  duration: number = 500
): Promise<void> {
  child.style.transitionDuration = `${duration}ms`;
  child.classList.add("fade");
  return new Promise((resolve) => {
    child.ontransitionend = () => {
      parent.removeChild(child);
      resolve();
    };
    child.classList.add("invisible");
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
    setTimeout(() => resolve(), duration);
  });
}
