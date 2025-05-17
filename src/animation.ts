export function fadeIn(
  parent: HTMLElement,
  child: HTMLElement,
  duration: number = 500
): Promise<void> {
  child.style.animationName = "fade-in";
  child.style.animationDuration = `${duration}ms`;
  parent.appendChild(child);
  return new Promise((resolve) => {
    child.onanimationend = () => {
      resolve();
    };
  });
}

export function fadeOut(
  parent: HTMLElement,
  child: HTMLElement,
  duration: number = 500
): Promise<void> {
  child.style.animationDuration = `${duration}ms`;
  child.style.animationName = "fade-out";
  return new Promise((resolve) => {
    child.onanimationend = () => {
      parent.removeChild(child);
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
    setTimeout(() => resolve(), duration);
  });
}
