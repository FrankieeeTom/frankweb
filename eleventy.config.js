import dotenv from 'dotenv'
import { DateTime } from "luxon";
import { Cloudinary } from '@cloudinary/url-gen';
import metagen from 'eleventy-plugin-metagen';
dotenv.config({ path: '.public-env' })
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.CLOUDINARY_NAME
  }
});

const TIME_ZONE = "Europe/Prague";

export default async function(eleventyConfig) {

  // Configure Eleventy
  // eleventyConfig.setLiquidParameterParsing("builtin");
  eleventyConfig.setInputDirectory("content");
  eleventyConfig.setIncludesDirectory("includes");
  eleventyConfig.addPassthroughCopy({ static: "/" });
  eleventyConfig.setLayoutsDirectory("templates");
  eleventyConfig.addPassthroughCopy("content/**/*.css", { mode: "html-relative" });
  eleventyConfig.addPassthroughCopy("content/**/*.jpg", { mode: "html-relative" });
  eleventyConfig.addPassthroughCopy("content/**/*.png", { mode: "html-relative" });

  eleventyConfig.addDateParsing(function(dateValue) {
    let localDate;
    if (dateValue instanceof Date) { // override YAML dates
      localDate = DateTime.fromJSDate(dateValue, { zone: "utc" }).setZone(TIME_ZONE, { keepLocalTime: true });
    } else if (typeof dateValue === "string") { // override String dates
      localDate = DateTime.fromISO(dateValue, { zone: TIME_ZONE });
    }
    if (localDate?.isValid === false) {
      throw new Error(`Invalid \`date\` value(${dateValue}) is invalid for ${this.page.inputPath}`);
    }
    return localDate;
  });

  eleventyConfig.addPlugin(metagen);

  // bundle plugin
  eleventyConfig.addBundle("html");

  function addToBundle(scope, bundle, code, bucket = "") {
    // from https://infrequently.org/2025/10/11ty-hacks-for-fun-and-performance/
    eleventyConfig.getPairedShortcode(bundle)
      .call(scope, code, bucket);
  }

  // Get the current year
  eleventyConfig.addShortcode("getYear", function() {
    const year = new Date().getFullYear();
    return year.toString();
  });


  eleventyConfig.addShortcode("cloudinaryVideo", async function(id) {
    return cloudinary.video(id).delivery('q_auto').toURL()
  });

  eleventyConfig.addShortcode("cloudinaryVideoThumbnail", async function(id) {
    return cloudinary.video(id).setAssetType('video').delivery('q_auto').format('auto:image').toURL()
  });

  eleventyConfig.addShortcode("cloudinaryImg", async function(id) {
    return cloudinary.image(id).delivery('q_auto').format('auto').toURL()
  });

  eleventyConfig.addFilter("sortByDate", async function(arr) {
    return arr.sort((a, b) => a.date < b.date ? -1 : 1)
  });

  eleventyConfig.addFilter("jsonParse", async function(json) {
    return JSON.parse(json)
  });


};
