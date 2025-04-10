import "./style.css";
import i18next from "i18next";
import { scenarios, Scenario } from "./scenarios";
import en from "./locales/en.json";
import de from "./locales/de.json";
import Options from "./Options";

await i18next.init({
  lng: "en", // TODO language detector
  debug: true,
  resources: { en: { translation: en }, de: { translation: de } },
});

let video: HTMLMediaElement;
let menu: HTMLElement;
let labelContainer: HTMLElement;

function playIdle() {
  // Play idle video
  video.src = idleVideo;
  video.loop = true;
  video.play();

  // Show scenario buttons
  menu.innerHTML = "";
  let scenarioOptions = new Options(
    menu,
    i18next.t("ChooseSituation"),
    scenarios.map((scenario) => {
      return {
        text: i18next.t(`${scenario.key}.name`),
        handler: () => {
          scenarioOptions.hide();
          showScenario(scenario);
        },
      };
    })
  );
  scenarioOptions.show();
}

function showScenario({ key, labels, videoSrc, options }: Scenario) {
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
    // Show entity labels
    for (const { key: labelKey, position } of labels) {
      labelContainer.innerHTML += `
        <div class="label" style="left:${position[0]}px;top:${position[1]}px">
          <div>${i18next.t(`${key}.${labelKey}.name`)}</div>
          <div>${i18next.t(`${key}.${labelKey}.description`)}</div>
        </div>
      `;
    }

    // Scenario options
    const choiceOptions = new Options(
      menu,
      i18next.t("Choose Policy"),
      options.map(({ key: optionKey, videoSrc }) => {
        const optionText = `${i18next.t(`${optionKey}.name`)}: ${i18next.t(
          `${optionKey}.objective`
        )}`;
        return {
          text: optionText,
          handler: () => {
            labelContainer.innerHTML = "";
            // Play the scenario out
            choiceOptions.hide();
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
    choiceOptions.show();
  };
}

window.onload = () => {
  video = document.getElementById("video") as HTMLMediaElement;
  menu = document.getElementById("menu")!;
  labelContainer = document.getElementById("labels")!;

  document.getElementById("start-button")!.onclick = playIdle;
};

const idleVideo =
  "https://videos.pexels.com/video-files/30975000/13241693_2160_1440_24fps.mp4";
