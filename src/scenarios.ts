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
}

export const scenarios: Scenario[] = [
  {
    key: "CarEntersLane",
    videoSrc: "/scene_3_0.mp4",
    labels: [
      { key: "AutonomousCar", position: [100, 100] },
      { key: "LuxuryCar", position: [100, 900] },
      { key: "Truck", position: [800, 100] },
      { key: "BusStop", position: [800, 900] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc: "/scene_3_1.mp4",
      },
      {
        key: "Profit",
        videoSrc: "/scene_3_2.mp4",
      },
      {
        key: "Protector",
        videoSrc: "/scene_3_3.mp4",
      },
    ],
  },
  {
    key: "ChildRuns",
    videoSrc: "/scene_2_0.mp4",
    labels: [
      { key: "AutonomousCar", position: [100, 100] },
      { key: "Ambulance", position: [100, 900] },
      { key: "Child", position: [800, 100] },
      { key: "OtherCar", position: [800, 900] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc: "/scene_2_1.mp4",
      },
      {
        key: "Profit",
        videoSrc: "/scene_2_2.mp4",
      },
      {
        key: "Protector",
        videoSrc: "/scene_2_3.mp4",
      },
    ],
  },
  {
    key: "TreeFalls",
    videoSrc: "/scene_1_0.mp4",
    labels: [
      { key: "AutonomousCar", position: [100, 100] },
      { key: "Cyclist", position: [100, 900] },
      { key: "FallenTree", position: [800, 100] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc: "/scene_1_1.mp4",
      },
      {
        key: "Profit",
        videoSrc: "/scene_1_2.mp4",
      },
      {
        key: "Protector",
        videoSrc: "/scene_1_3.mp4",
      },
    ],
  },
];
