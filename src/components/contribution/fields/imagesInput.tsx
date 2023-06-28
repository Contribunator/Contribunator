import { useField } from "formik";

import FieldHeader from "../common/fieldHeader";

import ImageInput, {
  Props as ImageInputProps,
  defaultInfo,
  MB,
  Image,
} from "./imageInput";
import { ValidationTypes } from "@/types";

export type Props = ImageInputProps & {
  validation?: ValidationTypes;
  totalFileSizeLimit?: number;
};

export default function ImagesInput({
  validation,
  totalFileSizeLimit = defaultInfo.fileSizeLimit,
  fileSizeLimit = 0,
  ...props
}: Props) {
  const { name, title } = {
    ...{ ...defaultInfo, title: "Upload Images" },
    ...props,
  };
  const [field, meta, helpers] = useField(name);

  const limit = validation?.max || 4;
  const images: Image[] = field?.value || [];

  let totalFileSize = 0;
  let lastExisting = 0;

  images.forEach(({ data }, i) => {
    if (data) {
      lastExisting = i + 1;
      const base64Image = data.split(",")[1];
      const fileSize = Math.round((base64Image.length * 3) / 4);
      totalFileSize += fileSize;
    }
  });

  const itemsToShow = lastExisting + 1 < limit ? lastExisting + 1 : limit;
  const limitReached = images.length >= itemsToShow;

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
    <div>
      {limitReached && <FieldHeader title={title} />}
      <div className="space-y-4">
        {Array(itemsToShow)
          .fill(null)
          .map((_, i) => (
            <ImageInput
              key={i}
              {...props}
              name={`${name}[${i}]`}
              fileSizeLimit={thisFileSizeLimit}
              title={`${title} (${limit - images.length} remaining)`}
              showErrors={false}
              handleRemove={() => {
                const newValues = [...images];
                newValues.splice(i, 1);
                helpers.setValue(
                  newValues.length === 0 ? undefined : newValues
                );
              }}
            />
          ))}
      </div>
      {meta.error && (
        <div>
          <FieldHeader name={name} error={meta.error} />
        </div>
      )}
    </div>
  );
}
