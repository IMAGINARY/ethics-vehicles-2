import "./style.css";
import i18next from "i18next";
import { scenarios, Scenario } from "./scenarios";
import en from "./locales/en.json";
import de from "./locales/de.json";

await i18next.init({
  lng: "en", // TODO language detector
  debug: true,
  resources: { en: { translation: en }, de: { translation: de } },
});

let video: HTMLMediaElement, menu: HTMLElement;

function playIdle() {
  // Play idle video
  video.src = idleVideo;
  video.loop = true;
  video.play();

  // Show scenario buttons
  menu.innerHTML = "";
  showOptions(
    i18next.t("ChooseSituation"),
    scenarios.map((scenario) => {
      return {
        text: i18next.t(`${scenario.key}.name`),
        handler: () => {
          showScenario(scenario);
        },
      };
    })
  );
}

function showScenario({ key, videoSrc, options }: Scenario) {
  // Play scenario video
  video.loop = false;
  video.src = videoSrc;
  video.play();
  menu.innerHTML = "";

  video.onended = () => {
    // Scenario introduction
    menu.innerHTML = `
      <h1>${i18next.t("Report")}</h1>
      <p>${i18next.t(`${key}.description`)}</p>
    `;
    // Scenario options
    const optionsEl = showOptions(
      i18next.t("Choose Policy"),
      options.map(({ key: optionKey, videoSrc }) => {
        const optionText = `${i18next.t(`${optionKey}.name`)}: ${i18next.t(
          `${optionKey}.objective`
        )}`;
        return {
          text: optionText,
          handler: () => {
            // Play the scenario out
            menu.removeChild(optionsEl);
            menu.innerHTML += `<p>${optionText}</p>`;
            video.loop = false;
            video.src = videoSrc;
            video.play();

            // Show concluding text and restart button
            video.onended = () => {
              menu.innerHTML += `<p>${i18next.t(`${key}.${optionKey}`)}</p>`;
              const restartButton = document.createElement("button");
              restartButton.textContent = i18next.t("Restart");
              restartButton.id = "start-button";
              restartButton.onclick = playIdle;
              menu.append(restartButton);
            };
          },
        };
      })
    );
  };
}

// Show a a prompt and a list of options
function showOptions(prompt: string, options: any) {
  const list = document.createElement("div");
  list.classList.add("options");
  list.innerHTML = `<h2>${prompt}</h2>`;
  for (const { text, handler } of options) {
    const button = document.createElement("button");
    button.textContent = text;
    list.append(button);
    button.onclick = handler;
  }
  menu.append(list);
  return list;
}

window.onload = () => {
  video = document.getElementById("video") as HTMLMediaElement;
  menu = document.getElementById("menu")!;

  document.getElementById("start-button")!.onclick = playIdle;
};

const idleVideo =
  "https://videos.pexels.com/video-files/30975000/13241693_2160_1440_24fps.mp4";
