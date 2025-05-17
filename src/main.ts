import "./style.css";
import {
  Scenario,
  Label,
  loadConfig,
  scenarios,
  policies,
  Config,
  PolicyKey,
  ScenarioKey,
} from "./config";
import { createI18nText, loadLanguages, switchLanguage } from "./i18n";
import { fadeIn, fadeOut, stagger } from "./animation";
import LongPressButton from "./LongPressButton";

const icons: Record<PolicyKey, string> = {
  Utilitarian: "/icons/Policy_Utilitarist.svg",
  Profit: "/icons/Policy_Profit.svg",
  Protector: "/icons/Policy_Protector.svg",
};

let videoContainer: HTMLElement;
let idleVideo: HTMLMediaElement;
let menu: HTMLElement;
let labelContainer: HTMLElement;
let langSwitcher: HTMLButtonElement;
let config: Config;
let scenarioVideos: Record<ScenarioKey, HTMLVideoElement> = {} as any;

window.onload = async () => {
  config = await loadConfig();
  await loadLanguages(config.langs);
  for (const [button, [x, y]] of Object.entries(config.buttonPositions)) {
    document.documentElement.style.setProperty(`--${button}-x`, `${x}px`);
    document.documentElement.style.setProperty(`--${button}-y`, `${y}px`);
  }

  videoContainer = document.getElementById("videos") as HTMLElement;
  idleVideo = document.getElementById("idle-video") as HTMLMediaElement;
  idleVideo.src = config.idleVideoSrc;
  menu = document.getElementById("menu")!;
  labelContainer = document.getElementById("labels")!;
  langSwitcher = document.getElementById("lang-switcher") as HTMLButtonElement;

  // Preload all the scenario videos
  for (let scenario of scenarios) {
    const video = document.createElement("video");
    video.loop = false;
    video.src = config.scenarios[scenario].videoSrc;
    video.preload = "auto";
    scenarioVideos[scenario] = video;
  }

  await showScenarioChoices();
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
  const arrowChoose = document.createElement("img");
  arrowChoose.src = "/icons/Arrow_Choose_Scenario.svg";
  arrowChoose.classList.add("arrow-choose-scenario");
  await fadeIn(menu, arrowChoose);

  const scenarioButtons = scenarios.map((scenario, i) => {
    return createButton({
      i18nKey: `${scenario}.name`,
      class: "scenario-button",
      key: (i + 1).toString(),
      async onPress() {
        await Promise.all([
          fadeOut(menu, heading),
          fadeOut(menu, arrowChoose),
          ...scenarioButtons.map((button) => button.hide()),
        ]);
        await showScenario(scenario, config.scenarios[scenario]);
      },
    });
  });
  await stagger(
    scenarioButtons.map((button) => {
      return () => button.show(menu);
    }),
    200
  );
}

async function showScenario(
  key: ScenarioKey,
  { labels, policyVideos }: Scenario
) {
  // Play scenario video
  const scenarioVideo = (scenarioVideos! as any)[key];
  scenarioVideo.play();
  await fadeIn(videoContainer, scenarioVideo, 1500);
  idleVideo.pause();

  scenarioVideo.onended = async () => {
    // Show entity labels
    for (const [labelKey, labelData] of Object.entries(labels)) {
      await createLabel(`${key}.${labelKey}`, labelData);
    }

    // Scenario introduction
    const reportContainer = document.createElement("div");
    reportContainer.classList.add("report-container");
    const report = document.createElement("div");
    report.classList.add("report");
    report.appendChild(createI18nText("h1", "Report"));
    report.appendChild(createI18nText("p", `${key}.description`));
    reportContainer.appendChild(report);

    const arrowNext = document.createElement("img");
    arrowNext.src = "/icons/Arrow_Next.svg";
    arrowNext.classList.add("arrow-next");
    await fadeIn(menu, reportContainer);
    // TODO This shows up unreliably. Could it be a file loading issue?
    await fadeIn(menu, arrowNext);

    // Scenario options
    const choiceButtons = policies.map((policy, index) => {
      return new LongPressButton({
        children: [
          createI18nText("h2", `${policy}.name`),
          createI18nText("div", `${policy}.objective`),
        ],
        key: (index + 1).toString(),
        class: "choice-button",
        async onFill() {
          await Promise.all(choiceButtons.map((button) => button.hide()));
          pickChoice(key, scenarioVideo, policy, policyVideos[policy]);
        },
      });
    });
    const nextButton = createButton({
      i18nKey: "Next",
      key: "2",
      class: "next-button",
      async onPress() {
        await Promise.all([nextButton.hide(), fadeOut(menu, arrowNext)]);
        const choosePolicy = createI18nText("div", "ChoosePolicy");
        choosePolicy.classList.add("choose-policy");
        await fadeIn(menu, choosePolicy);
        await stagger(
          choiceButtons.map((button) => {
            return () => button.show(menu);
          }),
          200
        );
      },
    });
    await nextButton.show(menu);
  };
}

async function pickChoice(
  scenarioKey: ScenarioKey,
  scenarioVideo: HTMLVideoElement,
  policyKey: PolicyKey,
  policyVideoSrc: string
) {
  const decisionVideo = document.createElement("video");
  decisionVideo.loop = false;
  decisionVideo.src = policyVideoSrc;
  decisionVideo.oncanplay = () => {
    videoContainer.removeChild(scenarioVideo);
  };
  videoContainer.appendChild(decisionVideo);
  await fadeOutChildren(menu);
  // Hide labels
  Promise.all(
    [...labelContainer.children].map((labelEl) => {
      fadeOut(labelContainer, labelEl as HTMLElement);
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
    icon.src = icons[policyKey];
    header.appendChild(icon);
    header.appendChild(createI18nText("h2", `${policyKey}.objective`));

    conclusion.appendChild(header);
    conclusion.appendChild(createI18nText("p", `${scenarioKey}.${policyKey}`));
    await fadeIn(menu, conclusion);

    const arrowRestart = document.createElement("img");
    arrowRestart.src = "/icons/Arrow_Restart.svg";
    arrowRestart.classList.add("arrow-restart");
    await fadeIn(menu, arrowRestart);

    const restartButton = createButton({
      i18nKey: "Restart",
      class: "restart-button",
      key: "3",
      async onPress() {
        idleVideo.play();
        // TODO for some reason putting this in the Promise
        // stops the scenarios from showing.
        await restartButton.hide();
        await Promise.all([
          fadeOut(videoContainer, decisionVideo, 1000),
          fadeOutChildren(menu),
        ]);
        await showScenarioChoices();
      },
    });
    await restartButton.show(menu);
  };
}

async function createLabel(key: string, { position, color, align }: Label) {
  const labelEl = document.createElement("div");
  labelEl.classList.add("label");
  labelEl.style.left = `${position[0]}px`;
  labelEl.style.top = `${position[1]}px`;
  labelEl.style.color = color ?? "white";
  labelEl.style.textAlign = align ?? "left";
  const name = createI18nText("div", `${key}.name`);
  name.classList.add("label-name");
  labelEl.append(name);
  labelEl.append(createI18nText("div", `${key}.description`));
  await fadeIn(labelContainer, labelEl, 750);
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
  button.classList.add("positioned-button");
  button.classList.add(`button-${key}`);
  button.onclick = () => {
    button.ontransitionend = () => {
      onPress();
    };
    button.classList.add("pressed");
  };

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

async function fadeOutChildren(parent: HTMLElement) {
  await Promise.all(
    [...parent.children].map((child) => fadeOut(parent, child as HTMLElement))
  );
}
