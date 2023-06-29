import sharp from "sharp";
import { e2e } from "@/lib/env";
import log from "@/lib/log";

type Images = { [fileName: string]: string };

// TODO add conversion options
export default async function convertImages(images: Images): Promise<Images> {
  const converted: Images = {};
  await Promise.all(
    Object.keys(images).map(async (fileName) => {
      try {
        const fileType = fileName.split(".").pop() as "png" | "jpg";
        // in e2e mode, skip this and return testable data
        if (e2e) {
          converted[fileName] = `[converted:${fileType}:${images[fileName]
            .split(",")[1]
            .slice(0, 6)}]`;
          return;
        }
        const start = new Date().getTime();
        const buffer = Buffer.from(images[fileName].split(",")[1], "base64");
        // TODO make max width configurable
        const convertedBuf = await sharp(buffer)
          .resize({ withoutEnlargement: true, width: 1600 })
          .toFormat(fileType)
          .toBuffer();
        converted[fileName] = convertedBuf.toString("base64");
        const taken = new Date().getTime() - start;
        log.info(`converted in ${taken}ms ${fileName}`);
      } catch (e) {
        log.error("Errorr converting", fileName);
        throw e;
      }
    })
  );

  return converted;
}
