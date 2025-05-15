import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
const videos = JSON.parse(fs.readFileSync("./videos.json"));
const url = process.env.VIDEO_URL || videos.defaultVideoURL;

console.log(`VIDEO_URL=${url}`);

async function downloadFile(url, filename, checksum) {
  const destination = path.resolve("./public/videos", filename);
  if (fs.existsSync(destination)) {
    if (checksumMatches(destination, checksum)) {
      console.log(`${filename} already exists.`);
      return;
    }
    fs.unlinkSync(destination);
    console.log(`${filename} is outdated. Redownloading...`);
  }
  const res = await fetch(url);
  console.log("Downloading", url);
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  console.log("Finished downloading", filename);
  if (!checksumMatches(destination, checksum)) {
    console.error(`Invalid checksum for ${filename}`);
    process.exit(1);
  }
}

function checksumMatches(path, checksum) {
  const file = fs.readFileSync(path);
  return createHash("sha256").update(file).digest("hex") === checksum;
}

for (const { name, checksum } of videos.videos) {
  await downloadFile(`${url}${name}`, name, checksum);
}
