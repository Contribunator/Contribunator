import sharp from "sharp";
import submitHook from "@/util/submitHook";
import tweetTransform from "../tweetTransform";
import schema from "../tweetSchema";

export const POST = submitHook("tweet", schema, async ({ body, timestamp }) => {
  // validate the tweet, TODO check will throw an error if invalid?
  const { files, name, media, branch } = tweetTransform(body, timestamp);

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
    files,
  };
});
