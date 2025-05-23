import yaml from "js-yaml";

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
  // TODO combine with local config
  const response = await fetch("/config.yaml");
  // TODO validate config
  return yaml.load(await response.text()) as Config;
}
