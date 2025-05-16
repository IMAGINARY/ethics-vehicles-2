import "./style.css";
import { scenarios, Scenario, ScenarioOption, Label } from "./scenarios";
import {
  createI18nText,
  getCurrentLang,
  refreshI18nText,
  changeLanguage,
} from "./i18n";
import { fadeIn, fadeOut } from "./animation";
import LongPressButton from "./LongPressButton";

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
];

const icons: Record<string, string> = {
  Utilitarian: "/icons/Policy_Utilitarist.svg",
  Profit: "/icons/Policy_Profit.svg",
  Protector: "/icons/Policy_Protector.svg",
};

let videoContainer: HTMLElement;
let idleVideo: HTMLMediaElement;
let menu: HTMLElement;
let labelContainer: HTMLElement;
let langSwitcher: HTMLButtonElement;

window.onload = () => {
  videoContainer = document.getElementById("videos") as HTMLElement;
  idleVideo = document.getElementById("idle-video") as HTMLMediaElement;
  menu = document.getElementById("menu")!;
  labelContainer = document.getElementById("labels")!;
  langSwitcher = document.getElementById("lang-switcher") as HTMLButtonElement;

  showScenarioChoices();
  langSwitcher.onclick = switchLanguage;
  document.addEventListener("keydown", (e) => {
    if (e.key === "l") {
      switchLanguage();
    }
  });
};

async function showScenarioChoices() {
  // Show scenario buttons
  const heading = createI18nText("h2", "ChooseSituation");
  heading.classList.add("situation-prompt");
  await fadeIn(menu, heading);
  const arrow = document.createElement("img");
  arrow.src = "/icons/Arrow_Choose_Scenario.svg";
  arrow.classList.add("arrow-choose-scenario");
  await fadeIn(menu, arrow);

  const scenarioButtons = scenarios.map((scenario, i) => {
    return createButton({
      i18nKey: `${scenario.key}.name`,
      class: "scenario-button",
      key: (i + 1).toString(),
      async onPress() {
        await Promise.all([
          fadeOut(menu, heading),
          fadeOut(menu, arrow),
          ...scenarioButtons.map((button) => button.hide()),
        ]);
        await showScenario(scenario);
      },
    });
  });
  await Promise.all(scenarioButtons.map((button) => button.show(menu)));
}

async function showScenario({ key, labels, videoSrc, options }: Scenario) {
  // Play scenario video
  const scenarioVideo = document.createElement("video");
  scenarioVideo.loop = false;
  scenarioVideo.src = videoSrc;
  scenarioVideo.preload = "auto";

  // pause the idle when we know we're completely loaded
  scenarioVideo.oncanplay = async () => {
    scenarioVideo.play();
    await fadeIn(videoContainer, scenarioVideo, 1500);
    idleVideo.pause();
  };

  scenarioVideo.onended = async () => {
    // Show entity labels
    for (const label of labels) {
      createLabel(key, label);
    }

    // Scenario introduction
    const reportContainer = document.createElement("div");
    reportContainer.classList.add("report-container");
    const report = document.createElement("div");
    report.classList.add("report");
    report.appendChild(createI18nText("h1", "Report"));
    report.appendChild(createI18nText("p", `${key}.description`));
    reportContainer.appendChild(report);
    await fadeIn(menu, reportContainer);

    const arrow = document.createElement("img");
    arrow.classList.add("arrow-next");
    arrow.src = "/icons/Arrow_Next.svg";
    await fadeIn(menu, arrow);

    // Scenario options
    const choiceButtons = options.map((option, index) => {
      return new LongPressButton({
        children: [
          createI18nText("h2", `${option.key}.name`),
          createI18nText("div", `${option.key}.objective`),
        ],
        key: (index + 1).toString(),
        class: "choice-button",
        async onFill() {
          await Promise.all(choiceButtons.map((button) => button.hide()));
          pickChoice(key, scenarioVideo, option);
        },
      });
    });
    const nextButton = createButton({
      i18nKey: "Next",
      key: "2",
      class: "next-button",
      async onPress() {
        await Promise.all([nextButton.hide(), fadeOut(menu, arrow)]);
        const choosePolicy = createI18nText("div", "ChoosePolicy");
        choosePolicy.classList.add("choose-policy");
        await fadeIn(menu, choosePolicy);
        await Promise.all(choiceButtons.map((button) => button.show(menu)));
      },
    });
    nextButton.show(menu);
  };
}

async function pickChoice(
  scenarioKey: string,
  scenarioVideo: HTMLVideoElement,
  { key: optionKey, videoSrc }: ScenarioOption
) {
  const decisionVideo = document.createElement("video");
  decisionVideo.loop = false;
  decisionVideo.src = videoSrc;
  decisionVideo.oncanplay = () => {
    videoContainer.removeChild(scenarioVideo);
  };
  videoContainer.appendChild(decisionVideo);
  await fadeOutChildren(menu);
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
    const conclusion = document.createElement("div");
    conclusion.classList.add("conclusion");
    const header = document.createElement("div");
    header.classList.add("header");
    const icon = document.createElement("img");
    icon.src = icons[optionKey];
    header.appendChild(icon);
    header.appendChild(createI18nText("h2", `${optionKey}.objective`));

    conclusion.appendChild(header);
    conclusion.appendChild(createI18nText("p", `${scenarioKey}.${optionKey}`));
    await fadeIn(menu, conclusion);

    const arrow = document.createElement("img");
    arrow.src = "/icons/Arrow_Restart.svg";
    arrow.classList.add("arrow-restart");
    fadeIn(menu, arrow);

    const restartButton = createButton({
      i18nKey: "Restart",
      class: "restart-button",
      key: "3",
      async onPress() {
        idleVideo.play();
        await restartButton.hide();
        await Promise.all([
          fadeOut(videoContainer, decisionVideo, 1000),
          fadeOutChildren(menu),
        ]);
        showScenarioChoices();
      },
    });
    await restartButton.show(menu);
  };
}

async function createLabel(
  scenarioKey: string,
  { position, color, align, key: labelKey }: Label
) {
  const labelEl = document.createElement("div");
  labelEl.classList.add("label");
  labelEl.style.left = `${position[0]}px`;
  labelEl.style.top = `${position[1]}px`;
  labelEl.style.color = color ?? "white";
  labelEl.style.textAlign = align ?? "left";
  const name = createI18nText("div", `${scenarioKey}.${labelKey}.name`);
  name.classList.add("label-name");
  labelEl.append(name);
  labelEl.append(
    createI18nText("div", `${scenarioKey}.${labelKey}.description`)
  );
  await fadeIn(labelContainer, labelEl);
}

interface ButtonProps {
  // Call on keydown or click
  onPress(): void;
  // i18n key of the button's text
  i18nKey: string;
  // Key to press to trigger the button
  key: string;
  // CSS class
  class: string;
}
function createButton({ class: cls, key, i18nKey, onPress }: ButtonProps) {
  const button = createI18nText("button", i18nKey);
  button.classList.add(cls);
  button.onclick = onPress;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === key) {
      button.click();
    }
  }

  return {
    async show(parent: HTMLElement) {
      await fadeIn(parent, button);
      document.addEventListener("keydown", handleKeydown);
    },
    async hide() {
      await fadeOut(button.parentElement!, button);
      document.removeEventListener("keydown", handleKeydown);
    },
  };
}

async function switchLanguage() {
  const currentIndex = languages.findIndex(
    ({ code }) => getCurrentLang() === code
  );
  const { name, code } = languages[(currentIndex + 1) % languages.length];
  changeLanguage(code);
  refreshI18nText();
  langSwitcher.textContent = name;
}

async function fadeOutChildren(parent: HTMLElement) {
  await Promise.all(
    [...parent.children].map((child) => fadeOut(parent, child as HTMLElement))
  );
}
