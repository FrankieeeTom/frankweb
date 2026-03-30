import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs';
import { Cloudinary } from '@cloudinary/url-gen';
import { imageDimensionsFromStream } from 'image-dimensions';
import { getVideoResolution } from "@oscnord/get-video-resolution";
import pc from "picocolors";
import { exit } from 'process';
dotenv.config({ path: '.public-env' })
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.CLOUDINARY_NAME,
    // apiKey: process.env.CLOUDINARY_KEY,
    // apiSecret: process.env.CLOUDINARY_SECRET
  }
});
const PATH = './content/_data/art-pieces.json'
let data
try {
  data = readFileSync(PATH);
} catch (error) {
  console.log(pc.red("Couldn't read file " + PATH + "\n" + error))
  exit(1)
}
data = JSON.parse(data)
let changedCount = 0
for (const media in data) {
  const element = data[media];
  if (!element.hasOwnProperty("height") || !element.hasOwnProperty("width")) {
    let info
    if (element.type === 'image') {
      let url
      if (element.hasOwnProperty("cloudinaryId")) {
        url = cloudinary.image(element.cloudinaryId).toURL()
      } else {
        url = element.url
      }
      const { body } = await fetch(url);
      info = await imageDimensionsFromStream(body);
    } else {
      // video

      let url
      if (element.hasOwnProperty("cloudinaryId")) {
        url = cloudinary.video(element.cloudinaryId).toURL()
      } else {
        url = element.url
      }
      info = await getVideoResolution(url, {
        sniff: true,
      });
    }
    element.width = info.width
    element.height = info.height
    changedCount++
    console.log(
      pc.blue(
        `Added width: ${info.width} and height: ${info.height} to "${element.title}" (${element.type})`
      )
    )
  }
}
if (changedCount === 0) {
  console.log(pc.blue(pc.bold("No images or videos without width or height attributes.")))
  exit(0)
}
console.log(
  pc.blue(pc.bold(
    `Done. Added properties to ${changedCount} images/videos.`
  )))
const newFile = JSON.stringify(data, null, 2)

try {
  writeFileSync(PATH, newFile)
} catch (error) {
  console.log(pc.red(
    "Couldn't write file" + PATH + "\n" + error
  ))
}
