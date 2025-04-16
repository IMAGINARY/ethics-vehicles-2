import "./style.css";
import i18next from "i18next";
import { scenarios, Scenario } from "./scenarios";
import en from "./locales/en.json";
import de from "./locales/de.json";
import Options from "./Options";
import { createI18nText, refreshI18nText } from "./i18n";

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
];

await i18next.init({
  lng: "en", // TODO language detector
  debug: true,
  resources: { en: { translation: en }, de: { translation: de } },
});

let video: HTMLMediaElement;
let menu: HTMLElement;
let labelContainer: HTMLElement;
let langSwitcher: HTMLButtonElement;

function playIdle() {
  // Play idle video
  video.src = idleVideo;
  video.loop = true;
  video.play();

  // Show scenario buttons
  menu.innerHTML = "";
  let scenarioOptions = new Options(
    menu,
    "ChooseSituation",
    scenarios.map((scenario) => {
      return {
        key: `${scenario.key}.name`,
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
    menu.append(createI18nText("h1", "Report"));
    menu.append(createI18nText("p", `${key}.description`));

    // Show entity labels
    for (const { key: labelKey, position } of labels) {
      const labelEl = document.createElement("div");
      labelEl.classList.add("label");
      labelEl.style = `left:${position[0]}px;top:${position[1]}px;`;
      labelEl.append(createI18nText("div", `${key}.${labelKey}.name`));
      labelEl.append(createI18nText("div", `${key}.${labelKey}.description`));
      labelContainer.append(labelEl);
    }

    // Scenario options
    const choiceOptions = new Options(
      menu,
      "Choose Policy",
      options.map(({ key: optionKey, videoSrc }) => {
        return {
          key: optionKey,
          handler: () => {
            labelContainer.innerHTML = "";
            // Play the scenario out
            choiceOptions.hide();
            menu.append(createI18nText("p", optionKey));
            video.loop = false;
            video.src = videoSrc;
            video.play();

            // Show concluding text and restart button
            video.onended = () => {
              menu.append(createI18nText("p", `${key}.${optionKey}`));
              const restartButton = createI18nText("button", `Restart`);
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

async function switchLanguage() {
  const currentIndex = languages.findIndex(
    ({ code }) => i18next.language === code
  );
  const { name, code } = languages[(currentIndex + 1) % languages.length];
  await i18next.changeLanguage(code);
  refreshI18nText();
  langSwitcher.textContent = name;
}

window.onload = () => {
  video = document.getElementById("video") as HTMLMediaElement;
  menu = document.getElementById("menu")!;
  labelContainer = document.getElementById("labels")!;
  langSwitcher = document.getElementById("lang-switcher") as HTMLButtonElement;

  document.getElementById("start-button")!.onclick = playIdle;
  langSwitcher.onclick = switchLanguage;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      switchLanguage();
    }
  });
};

const idleVideo =
  "https://videos.pexels.com/video-files/30975000/13241693_2160_1440_24fps.mp4";
