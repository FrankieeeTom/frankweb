import 'dotenv/config'
import { readFileSync, writeFileSync } from 'fs';
import { Cloudinary } from '@cloudinary/url-gen';
import { imageDimensionsFromStream } from 'image-dimensions';
import { getVideoResolution } from "@oscnord/get-video-resolution";
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.CLOUDINARY_NAME,
    // apiKey: process.env.CLOUDINARY_KEY,
    // apiSecret: process.env.CLOUDINARY_SECRET
  }
});
const PATH = './content/_data/art-pieces.json'
let data = readFileSync(PATH);
data = JSON.parse(data)
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
  }
}
const newFile = JSON.stringify(data, null, 2)
writeFileSync(PATH, newFile)
