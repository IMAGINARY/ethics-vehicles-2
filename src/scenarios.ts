export interface Scenario {
  key: string;
  videoSrc: string;
  options: ScenarioOption[];
}

export interface ScenarioOption {
  key: string;
  videoSrc: string;
}

export const scenarios: Scenario[] = [
  {
    key: "CarEntersLane",
    videoSrc:
      "https://videos.pexels.com/video-files/30221480/12957890_1920_1080_30fps.mp4",
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
      "https://videos.pexels.com/video-files/7865322/7865322-uhd_2560_1440_30fps.mp4",
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
      "https://videos.pexels.com/video-files/31381823/13390461_1920_1080_30fps.mp4",
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
