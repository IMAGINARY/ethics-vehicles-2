export function fadeIn(parent: HTMLElement, child: HTMLElement): Promise<void> {
  child.classList.add("fade");
  child.classList.add("invisible");
  parent.appendChild(child);
  return new Promise((resolve) => {
    child.ontransitionend = () => {
      resolve();
    };
    setTimeout(() => {
      child.classList.remove("invisible");
    }, 0);
  });
}

export function fadeOut(
  parent: HTMLElement,
  child: HTMLElement
): Promise<void> {
  child.classList.add("fade");
  return new Promise((resolve) => {
    child.ontransitionend = () => {
      parent.removeChild(child);
      resolve();
    };
    child.classList.add("invisible");
  });
}
