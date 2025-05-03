import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
const url = process.env.VIDEO_URL;

console.log(`VIDEO_URL=${url}`);

// TODO These should probably be configured somewhere
const videos = [
  "idle.mp4",
  "scene_1_0.mp4",
  "scene_1_1.mp4",
  "scene_1_2.mp4",
  "scene_1_3.mp4",
  "scene_2_0.mp4",
  "scene_2_1.mp4",
  "scene_2_2.mp4",
  "scene_2_3.mp4",
  "scene_3_0.mp4",
  "scene_3_1.mp4",
  "scene_3_2.mp4",
  "scene_3_3.mp4",
];

async function downloadFile(url, filename) {
  const destination = path.resolve("./public", filename);
  if (fs.existsSync(destination)) {
    console.log(`${filename} already exists.`);
    return;
  }
  const res = await fetch(url);
  console.log("Downloading", url);
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  console.log("Finished downloading", filename);
}

await Promise.all(
  videos.map((video) => {
    downloadFile(`${url}${video}`, video);
  })
);
