import yaml from "js-yaml";
import deepmerge from "deepmerge";

// TODO not sure if the order should be hardcoded or put in the file
export const scenarios = ["TreeFalls", "CarEntersLane", "ChildRuns"] as const;
export const policies = ["Utilitarian", "Protector", "Profit"] as const;

export type ScenarioKey = (typeof scenarios)[number];
export type PolicyKey = (typeof policies)[number];

export interface Config {
  buttonPositions: Record<string, [number, number]>;
  langs: string[];
  scenarios: Record<ScenarioKey, Scenario>;
  idleVideoSrc: string;
}

export interface Scenario {
  videoSrc: string;
  labels: Record<string, Label>;
  policyVideos: Record<PolicyKey, string>;
}

export interface Label {
  position: [number, number];
  color?: string;
  align?: string;
  width?: number;
}

export async function loadConfig() {
  const baseConfig = await loadConfigFile("./config.yaml");
  const userConfig = await loadConfigFile("./settings.yaml");
  // TODO validate config
  return deepmerge(baseConfig, userConfig, {
    arrayMerge: (_destArray, sourceArray, _options) => sourceArray,
  }) as Config;
}

export async function loadConfigFile(filename: string) {
  try {
    const response = await fetch(filename, { cache: "no-cache" });
    if (!response.ok) {
      return {};
    }
    return yaml.load(await response.text()) as Config;
  } catch (e) {
    console.error(e);
    return {};
  }
}
