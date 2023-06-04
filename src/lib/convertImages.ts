import sharp from "sharp";

type Images = { [fileName: string]: string };

// TODO add conversion options
export async function convertImages(images: Images): Promise<Images> {
  const converted: Images = {};
  await Promise.all(
    Object.keys(images).map(async (fileName) => {
      try {
        const start = new Date().getTime();
        const fileType = fileName.split(".").pop() as "png" | "jpg";
        const buffer = Buffer.from(images[fileName].split(",")[1], "base64");
        // TODO make max width configurable
        const convertedBuf = await sharp(buffer)
          .resize({ withoutEnlargement: true, width: 1600 })
          .toFormat(fileType)
          .toBuffer();
        converted[fileName] = convertedBuf.toString("base64");
        const taken = new Date().getTime() - start;
        console.log(`converted in ${taken}ms ${fileName}`);
      } catch (e) {
        console.log("Errorr converting", fileName);
        throw e;
      }
    })
  );

  return converted;
}
