import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";

const videoData = JSON.parse(fs.readFileSync("./videos.json"));
const url = process.env.VIDEO_URL || videoData.defaultVideoURL;
const args = process.argv.slice(2);
const updateChecksums = args.includes("--update-checksums");

console.log(`VIDEO_URL=${url}`);

if (!fs.existsSync("./public/videos")) {
  fs.mkdirSync("./public/videos");
}

if (!updateChecksums) {
  for (const { name, checksum } of videoData.videos) {
    await downloadFile(`${url}${name}`, name, checksum);
  }
} else {
  // if --update-checksums is provided, always download the video,
  // and update the checksums in videos.json
  for (const v of videoData.videos) {
    const checksum = await downloadFileWithChecksum(`${url}${v.name}`, v.name);
    v.checksum = checksum;
  }
  fs.writeFileSync("./videos.json", JSON.stringify(videoData, null, 2) + "\n");
}

async function downloadFileWithChecksum(url, filename) {
  const destination = path.resolve("./public/videos", filename);
  if (fs.existsSync(destination)) {
    fs.unlinkSync(destination);
  }
  const res = await fetch(url);
  console.log("Downloading", url);
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  console.log("Finished downloading", filename);
  return getChecksum(destination);
}

async function downloadFile(url, filename, checksum) {
  const destination = path.resolve("./public/videos", filename);
  if (fs.existsSync(destination)) {
    if (getChecksum(destination) === checksum) {
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
  if (getChecksum(destination) !== checksum) {
    console.error(`Invalid checksum for ${filename}`);
    process.exit(1);
  }
}

function getChecksum(path) {
  const file = fs.readFileSync(path);
  return createHash("sha256").update(file).digest("hex");
}
