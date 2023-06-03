import { useField } from "formik";

import ImageInput, {
  ImageInput as ImageInputProps,
  defaultInfo,
  MB,
} from "./imageInput";

export type ImagesInput = ImageInputProps & {
  limit: number;
  totalFileSizeLimit?: number;
};

export default function ImagesInput({
  limit,
  totalFileSizeLimit = defaultInfo.fileSizeLimit,
  fileSizeLimit = 0,
  ...props
}: ImagesInput) {
  const { name, title } = {
    ...{ ...defaultInfo, title: "Upload Images" },
    ...props,
  };
  const [field] = useField(name);
  const values = field.value || [];
  const count = values.filter((i: any) => i).length;
  let firstEmptySlot = 0;
  let totalFileSize = 0;
  const imageFields = new Array(limit).fill(null).map((_, i) => {
    const exists = values[i] && values[i] !== "editing";
    if (exists) {
      const base64Image = values[i].split(",")[1];
      const fileSize = Math.round((base64Image.length * 3) / 4);
      totalFileSize += fileSize;
    } else if (!firstEmptySlot) {
      firstEmptySlot = i + 1;
    }
    return {
      name: `${name}[${i}]`,
      show: exists || i + 1 === firstEmptySlot,
    };
  });
  // calculate the filesize based on text length
  const remainingFileSizeLimit = totalFileSizeLimit
    ? parseFloat((totalFileSizeLimit - totalFileSize / MB).toFixed(1))
    : fileSizeLimit;

  // if the filesize limit is less than the remaining limit, use that
  const thisFileSizeLimit =
    fileSizeLimit && fileSizeLimit <= remainingFileSizeLimit
      ? fileSizeLimit
      : remainingFileSizeLimit;

  return (
    <>
      {imageFields
        .filter(({ show }) => show)
        .map((field) => (
          <ImageInput
            key={field.name}
            {...props}
            name={field.name}
            fileSizeLimit={thisFileSizeLimit}
            title={`${title} (${limit - count} remaining)`}
          />
        ))}
    </>
  );
}
