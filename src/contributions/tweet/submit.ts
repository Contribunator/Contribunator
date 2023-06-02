"use server";

import sharp from "sharp";

import pullRequestHandler from "@/lib/pullRequestHandler";

import transform from "./transform";
import schema from "./schema";

// TODO, refactor and use the `commit` from generic..
// tweet is validated by passing the schema
// TODO replace *all* of this with generic method hook using standard transform interface?

export const POST = pullRequestHandler(schema, async ({ body, timestamp }) => {
  const { files, name, media, branch, message } = transform(body, timestamp);

  // convert media - todo move to utility function
  await Promise.all(
    Object.keys(media).map(async (fileName) => {
      try {
        const start = new Date().getTime();
        const fileType = fileName.split(".").pop() as "png" | "jpg";
        const mediaBuf = Buffer.from(media[fileName].split(",")[1], "base64");
        // TODO make max width configurable
        const convertedBuf = await sharp(mediaBuf)
          .resize({ withoutEnlargement: true, width: 1600 })
          .toFormat(fileType)
          .toBuffer();
        files[fileName] = convertedBuf.toString("base64");
        const taken = new Date().getTime() - start;
        console.log(`converted in ${taken}ms ${fileName}`);
      } catch (e) {
        console.log("Errorr converting", fileName);
        throw e;
      }
    })
  );

  return {
    branch,
    name,
    message,
    files,
  };
});
