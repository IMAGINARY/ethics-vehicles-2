import "./style.css";
let video, menu;

function playIdle() {
  // Play idle video
  video.src = idleVideo;
  video.loop = true;
  video.play();

  // Show scenario buttons
  menu.innerHTML = "";
  showOptions(
    scenarios.map(({ title, videoSrc, options }) => {
      return {
        text: title,
        handler: () => {
          video.loop = false;
          video.src = videoSrc;
          video.play();
          menu.innerHTML = "";

          video.onended = () => {
            menu.innerHTML = "";
            showOptions(
              options.map(({ title, videoSrc }) => {
                return {
                  text: title,
                  handler: () => {
                    menu.innerHTML = "";
                    video.loop = false;
                    video.src = videoSrc;
                    video.play();

                    video.onended = () => {
                      const restartButton = document.createElement("button");
                      restartButton.textContent = "Restart";
                      restartButton.id = "start-button";
                      restartButton.onclick = playIdle;
                      menu.append(restartButton);
                    };
                  },
                };
              })
            );
          };
        },
      };
    })
  );
}

function showOptions(options) {
  const list = document.createElement("div");
  for (const { text, handler } of options) {
    const button = document.createElement("button");
    button.textContent = text;
    list.append(button);
    button.onclick = handler;
  }
  menu.append(list);
}

window.onload = () => {
  video = document.getElementById("video");
  menu = document.getElementById("menu");

  document.getElementById("start-button").onclick = playIdle;
};

const idleVideo =
  "https://videos.pexels.com/video-files/30975000/13241693_2160_1440_24fps.mp4";

const scenarios = [
  {
    title: "Scenario 1",
    videoSrc:
      "https://videos.pexels.com/video-files/30221480/12957890_1920_1080_30fps.mp4",
    options: [
      {
        title: "Option 1",
        videoSrc:
          "https://videos.pexels.com/video-files/31197958/13326009_2560_1440_25fps.mp4",
      },
      {
        title: "Option 2",
        videoSrc:
          "https://videos.pexels.com/video-files/31374437/13388231_2560_1440_25fps.mp4",
      },
      {
        title: "Option 3",
        videoSrc:
          "https://videos.pexels.com/video-files/30886113/13206249_2560_1440_60fps.mp4",
      },
    ],
  },
  {
    title: "Scenario 2",
    videoSrc:
      "https://videos.pexels.com/video-files/7865322/7865322-uhd_2560_1440_30fps.mp4",
    options: [
      {
        title: "Option 1",
        videoSrc:
          "https://videos.pexels.com/video-files/31197958/13326009_2560_1440_25fps.mp4",
      },
      {
        title: "Option 2",
        videoSrc:
          "https://videos.pexels.com/video-files/31374437/13388231_2560_1440_25fps.mp4",
      },
      {
        title: "Option 3",
        videoSrc:
          "https://videos.pexels.com/video-files/30886113/13206249_2560_1440_60fps.mp4",
      },
    ],
  },
  {
    title: "Scenario 3",
    videoSrc:
      "https://videos.pexels.com/video-files/31381823/13390461_1920_1080_30fps.mp4",
    options: [
      {
        title: "Option 1",
        videoSrc:
          "https://videos.pexels.com/video-files/31197958/13326009_2560_1440_25fps.mp4",
      },
      {
        title: "Option 2",
        videoSrc:
          "https://videos.pexels.com/video-files/31374437/13388231_2560_1440_25fps.mp4",
      },
      {
        title: "Option 3",
        videoSrc:
          "https://videos.pexels.com/video-files/30886113/13206249_2560_1440_60fps.mp4",
      },
    ],
  },
];
