import yaml from "js-yaml";

interface Config {
  langs: string[];
  scenarios: Scenario[];
}

export interface Scenario {
  key: string;
  videoSrc: string;
  labels: Label[];
  options: ScenarioOption[];
}

export interface ScenarioOption {
  key: string;
  videoSrc: string;
}

export interface Label {
  key: string;
  position: [number, number];
  color?: string;
  align?: string;
}
export async function loadConfig() {
  // TODO combine with local config
  const response = await fetch("/config.yaml");
  // TODO validate config
  return yaml.load(await response.text()) as Config;
}
