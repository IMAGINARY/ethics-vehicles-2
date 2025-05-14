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
    key: "TreeFalls",
    videoSrc: "/videos/scene_1_0.mp4",
    labels: [
      { key: "AutonomousCar", position: [450, 660] },
      { key: "Cyclist", position: [500, 1080] },
      { key: "FallenTree", position: [270, 975] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc: "/videos/scene_1_1.mp4",
      },
      {
        key: "Profit",
        videoSrc: "/videos/scene_1_2.mp4",
      },
      {
        key: "Protector",
        videoSrc: "/videos/scene_1_3.mp4",
      },
    ],
  },
  {
    key: "CarEntersLane",
    videoSrc: "/videos/scene_3_0.mp4",
    labels: [
      { key: "AutonomousCar", position: [1390, 1000] },
      { key: "LuxuryCar", position: [1310, 610] },
      { key: "Truck", position: [1620, 710] },
      { key: "BusStop", position: [1050, 740] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc: "/videos/scene_3_1.mp4",
      },
      {
        key: "Profit",
        videoSrc: "/videos/scene_3_2.mp4",
      },
      {
        key: "Protector",
        videoSrc: "/videos/scene_3_3.mp4",
      },
    ],
  },
  {
    key: "ChildRuns",
    videoSrc: "/videos/scene_2_0.mp4",
    labels: [
      { key: "AutonomousCar", position: [850, 1220] },
      { key: "Ambulance", position: [980, 1020] },
      { key: "Child", position: [660, 1040] },
      { key: "OtherCar", position: [650, 1290] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc: "/videos/scene_2_1.mp4",
      },
      {
        key: "Profit",
        videoSrc: "/videos/scene_2_2.mp4",
      },
      {
        key: "Protector",
        videoSrc: "/videos/scene_2_3.mp4",
      },
    ],
  },
];
