"use server";

import sharp from "sharp";

import { PullRequestInfo, TransformInputs } from "@/lib/pullRequestHandler";

import transformToPR from "./transformToPR";

export default async function submitTweet(
  props: TransformInputs
): Promise<PullRequestInfo> {
  const { files, title, media, branch, message } = transformToPR(props);

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
    title,
    message,
    files,
  };
}
