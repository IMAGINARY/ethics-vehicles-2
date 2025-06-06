// @ts-ignore
import "@fontsource/space-grotesk";
import "./style.css";
import {
  Scenario,
  loadConfig,
  scenarios,
  policies,
  Config,
  PolicyKey,
  ScenarioKey,
} from "./config";
import { createI18nText, loadLanguages, switchLanguage } from "./i18n";
import { animateIn, animateOut, delay, stagger } from "./animation";
import { createButton } from "./buttons";
import { createLabel } from "./labels";
import IdleMessages from "./idleMessages";

const icons: Record<PolicyKey, string> = {
  Utilitarian: "/icons/Policy_Utilitarist.svg",
  Profit: "/icons/Policy_Profit.svg",
  Protector: "/icons/Policy_Protector.svg",
};

let app: HTMLElement;
let videoContainer: HTMLElement;
let idleVideo: HTMLMediaElement;
let menu: HTMLElement;
let labelContainer: HTMLElement;
let config: Config;
let scenarioVideos: Record<ScenarioKey, HTMLVideoElement> = {} as any;

window.onload = async () => {
  config = await loadConfig();
  await loadLanguages(config.langs);

  for (const [button, [x, y]] of Object.entries(config.buttonPositions)) {
    document.documentElement.style.setProperty(`--${button}-x`, `${x}px`);
    document.documentElement.style.setProperty(`--${button}-y`, `${y}px`);
  }

  app = document.getElementById("app") as HTMLElement;
  videoContainer = document.getElementById("videos") as HTMLElement;
  idleVideo = document.getElementById("idle-video") as HTMLMediaElement;
  idleVideo.src = config.idleVideoSrc;
  menu = document.getElementById("menu")!;
  labelContainer = document.getElementById("labels")!;

  // Preload all the scenario videos
  for (let scenario of scenarios) {
    const video = document.createElement("video");
    video.loop = false;
    video.src = config.scenarios[scenario].videoSrc;
    video.preload = "auto";
    scenarioVideos[scenario] = video;
  }

  // Set up language switching
  const langButton = document.createElement("button");
  langButton.classList.add("lang-button");
  langButton.onclick = switchLanguage;
  app.appendChild(langButton);

  document.addEventListener("keydown", (e) => {
    if (e.key === "l") {
      switchLanguage();
    }
  });

  // Begin idle animation
  await showScenarioChoices();
};

async function showScenarioChoices() {
  // Show scenario buttons
  const heading = createI18nText("h2", "ChooseSituation");
  heading.classList.add("situation-prompt");
  await animateIn(menu, heading);
  const arrowChoose = document.createElement("img");
  arrowChoose.src = "/icons/Arrow_Choose_Scenario.svg";
  arrowChoose.classList.add("arrow-choose-scenario");
  await animateIn(menu, arrowChoose);
  const idleMsgs = new IdleMessages();

  const scenarioButtons = scenarios.map((scenario, i) => {
    return createButton({
      i18nKey: `${scenario}.name`,
      class: "scenario-button",
      key: (i + 1).toString(),
      async onPress() {
        await Promise.all([
          animateOut(heading),
          animateOut(arrowChoose),
          idleMsgs.hide(),
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
  idleMsgs.show(menu);
}

async function showScenario(
  key: ScenarioKey,
  { labels, policyVideos }: Scenario
) {
  // Play scenario video
  const scenarioVideo = (scenarioVideos! as any)[key];
  scenarioVideo.play();
  await animateIn(videoContainer, scenarioVideo, { duration: 1500 });
  idleVideo.pause();

  scenarioVideo.onended = async () => {
    // Show entity labels
    for (const [labelKey, labelData] of Object.entries(labels)) {
      await createLabel(`${key}.${labelKey}`, labelData);
      await delay(500);
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
    await animateIn(menu, reportContainer, {
      animation: "fadeInUp",
      duration: 750,
    });
    // TODO This shows up unreliably on Firefox
    await animateIn(menu, arrowNext);

    // Scenario options
    const nextButton = createButton({
      i18nKey: "Next",
      key: "2",
      class: "next-button",
      async onPress() {
        const choiceButtons = policies.map((policy, index) => {
          return createButton({
            children: [
              createI18nText("h2", `${policy}.name`),
              createI18nText("div", `${policy}.objective`),
            ],
            class: "choice-button",
            key: (index + 1).toString(),
            async onPress() {
              await Promise.all(choiceButtons.map((button) => button.hide()));
              pickChoice(key, scenarioVideo, policy, policyVideos[policy]);
            },
          });
        });
        await Promise.all([nextButton.hide(), animateOut(arrowNext)]);
        const choosePolicy = createI18nText("div", "ChoosePolicy");
        choosePolicy.classList.add("choose-policy");
        await animateIn(report, choosePolicy);
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
      animateOut(labelEl as HTMLElement);
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
    header.appendChild(createI18nText("h2", `${policyKey}.objectiveHeader`));

    conclusion.appendChild(header);
    conclusion.appendChild(createI18nText("p", `${scenarioKey}.${policyKey}`));
    await animateIn(menu, conclusion, {
      animation: "fadeInUp",
      duration: 1000,
    });

    const arrowRestart = document.createElement("img");
    arrowRestart.src = "/icons/Arrow_Restart.svg";
    arrowRestart.classList.add("arrow-restart");
    await animateIn(menu, arrowRestart);

    const restartButton = createButton({
      i18nKey: "Restart",
      class: "restart-button",
      key: "3",
      async onPress() {
        idleVideo.play();
        await Promise.all([
          animateOut(decisionVideo, { duration: 1000 }),
          restartButton.hide(),
          animateOut(arrowRestart),
          animateOut(conclusion, { animation: "fadeOutDown", duration: 1000 }),
        ]);
        await showScenarioChoices();
      },
    });
    await restartButton.show(menu);
  };
}

async function fadeOutChildren(parent: HTMLElement) {
  await Promise.all(
    [...parent.children].map((child) => animateOut(child as HTMLElement))
  );
}
