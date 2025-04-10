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
    videoSrc:
      "https://videos.pexels.com/video-files/30221480/12957890_1920_1080_30fps.mp4",
    labels: [
      { key: "AutonomousCar", position: [100, 100] },
      { key: "LuxuryCar", position: [100, 900] },
      { key: "Truck", position: [800, 100] },
      { key: "BusStop", position: [800, 900] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc:
          "https://videos.pexels.com/video-files/31197958/13326009_2560_1440_25fps.mp4",
      },
      {
        key: "Profit",
        videoSrc:
          "https://videos.pexels.com/video-files/31374437/13388231_2560_1440_25fps.mp4",
      },
      {
        key: "Protector",
        videoSrc:
          "https://videos.pexels.com/video-files/30886113/13206249_2560_1440_60fps.mp4",
      },
    ],
  },
  {
    key: "ChildRuns",
    videoSrc:
      "https://videos.pexels.com/video-files/30221480/12957890_1920_1080_30fps.mp4",
    labels: [
      { key: "AutonomousCar", position: [100, 100] },
      { key: "Ambulance", position: [100, 900] },
      { key: "Child", position: [800, 100] },
      { key: "OtherCar", position: [800, 900] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc:
          "https://videos.pexels.com/video-files/31197958/13326009_2560_1440_25fps.mp4",
      },
      {
        key: "Profit",
        videoSrc:
          "https://videos.pexels.com/video-files/31374437/13388231_2560_1440_25fps.mp4",
      },
      {
        key: "Protector",
        videoSrc:
          "https://videos.pexels.com/video-files/30886113/13206249_2560_1440_60fps.mp4",
      },
    ],
  },
  {
    key: "TreeFalls",
    videoSrc:
      "https://videos.pexels.com/video-files/30221480/12957890_1920_1080_30fps.mp4",
    labels: [
      { key: "AutonomousCar", position: [100, 100] },
      { key: "Cyclist", position: [100, 900] },
      { key: "FallenTree", position: [800, 100] },
    ],
    options: [
      {
        key: "Utilitarian",
        videoSrc:
          "https://videos.pexels.com/video-files/31197958/13326009_2560_1440_25fps.mp4",
      },
      {
        key: "Profit",
        videoSrc:
          "https://videos.pexels.com/video-files/31374437/13388231_2560_1440_25fps.mp4",
      },
      {
        key: "Protector",
        videoSrc:
          "https://videos.pexels.com/video-files/30886113/13206249_2560_1440_60fps.mp4",
      },
    ],
  },
];
