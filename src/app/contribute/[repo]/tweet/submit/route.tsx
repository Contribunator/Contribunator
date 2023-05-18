import sharp from "sharp";
import submitHook from "@/util/submitHook";
import transformTweet from "../transformTweet";
import validateTweet from "../validateTweet";

// TODO make the export prettier, single-liner possible?
// TODO rename it, it's not a "hook"
const POST = submitHook(async ({ body, timestamp }) => {
  // validate the tweet, TODO check will throw an error if invalid?
  await validateTweet.validate(body);
  const { files, name, media, branch } = transformTweet(body, timestamp);

  // convert media
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

export { POST };
