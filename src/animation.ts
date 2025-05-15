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
    }, 0);
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
