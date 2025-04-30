import "./style.css";
import i18next from "i18next";
import { scenarios, Scenario } from "./scenarios";
import en from "./locales/en.json";
import de from "./locales/de.json";
import Options from "./Options";
import { createI18nText, refreshI18nText } from "./i18n";
import { fadeIn, fadeOut } from "./animation";

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
];

await i18next.init({
  lng: "en", // TODO language detector
  debug: true,
  resources: { en: { translation: en }, de: { translation: de } },
});

let videoContainer: HTMLElement;
let idleVideo: HTMLMediaElement;
let menu: HTMLElement;
let labelContainer: HTMLElement;
let langSwitcher: HTMLButtonElement;

async function showScenarioChoices() {
  // Show scenario buttons
  let scenarioOptions = new Options(
    menu,
    "ChooseSituation",
    scenarios.map((scenario) => {
      return {
        key: `${scenario.key}.name`,
        handler: async () => {
          await scenarioOptions.hide();
          await showScenario(scenario);
        },
      };
    })
  );
  await scenarioOptions.show();
}

async function showScenario({ key, labels, videoSrc, options }: Scenario) {
  // Play scenario video
  const scenarioVideo = document.createElement("video");
  scenarioVideo.loop = false;
  scenarioVideo.src = videoSrc;
  menu.innerHTML = "";

  // pause the idle when we know we're completely loaded
  scenarioVideo.oncanplay = async () => {
    scenarioVideo.play();
    await fadeIn(videoContainer, scenarioVideo, 1500);
    idleVideo.pause();
  };

  scenarioVideo.onended = async () => {
    // Show entity labels
    for (const { key: labelKey, position } of labels) {
      const labelEl = document.createElement("div");
      labelEl.classList.add("label");
      labelEl.style = `left:${position[0]}px;top:${position[1]}px;`;
      labelEl.append(createI18nText("div", `${key}.${labelKey}.name`));
      labelEl.append(createI18nText("div", `${key}.${labelKey}.description`));
      await fadeIn(labelContainer, labelEl);
    }

    // Scenario introduction
    const intro = document.createElement("div");
    intro.appendChild(createI18nText("h1", "Report"));
    intro.appendChild(createI18nText("p", `${key}.description`));
    await fadeIn(menu, intro);

    // Scenario options
    const choiceOptions = new Options(
      menu,
      "Choose Policy",
      options.map(({ key: optionKey, videoSrc }) => {
        return {
          key: optionKey,
          handler: async () => {
            const decisionVideo = document.createElement("video");
            decisionVideo.loop = false;
            decisionVideo.src = videoSrc;
            decisionVideo.oncanplay = () => {
              videoContainer.removeChild(scenarioVideo);
            };
            videoContainer.appendChild(decisionVideo);
            await choiceOptions.hide();
            await fadeIn(menu, createI18nText("p", optionKey));
            // Hide labels
            await Promise.all(
              [...labelContainer.children].map(async (labelEl) => {
                await fadeOut(labelContainer, labelEl as HTMLElement);
              })
            );
            // Play the scenario out
            decisionVideo.play();

            // Show concluding text and restart button
            decisionVideo.onended = async () => {
              await fadeIn(menu, createI18nText("p", `${key}.${optionKey}`));
              const restartButton = createI18nText("button", `Restart`);
              restartButton.id = "start-button";
              restartButton.onclick = async () => {
                idleVideo.play();
                await Promise.all([
                  fadeOut(videoContainer, decisionVideo, 1000),
                  fadeOutChildren(menu),
                ]);
                showScenarioChoices();
              };
              await fadeIn(menu, restartButton);
            };
          },
        };
      })
    );
    await choiceOptions.show();
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

async function fadeOutChildren(parent: HTMLElement) {
  await Promise.all(
    [...parent.children].map((child) => fadeOut(parent, child as HTMLElement))
  );
}

window.onload = () => {
  videoContainer = document.getElementById("videos") as HTMLElement;
  idleVideo = document.getElementById("idle-video") as HTMLMediaElement;
  menu = document.getElementById("menu")!;
  labelContainer = document.getElementById("labels")!;
  langSwitcher = document.getElementById("lang-switcher") as HTMLButtonElement;

  showScenarioChoices();
  langSwitcher.onclick = switchLanguage;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      switchLanguage();
    }
  });
};
