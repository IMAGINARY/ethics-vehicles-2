// Clean the public directory of any mp4 files

import fs from "fs";
import path from "path";

const videos = fs
  .readdirSync("./public/videos")
  .filter((file) => path.extname(file) === ".mp4");

for (const video of videos) {
  fs.unlinkSync(`./public/videos/${video}`);
}
