import { useRef, useState } from "react";
import { useField } from "formik";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

import TextInput from "./textInput";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import FieldHeader from "./fieldHeader";
import RemoveButton from "./removeButton";

type Image = {
  url: string;
  type: string;
};

export type ImageInput = {
  fileSizeLimit?: number;
  title?: string;
  name: string;
  info?: string;
  aspectRatio?: number;
};

export const MB = 1048576;

export const defaultInfo = {
  title: "Upload Image",
  info: "PNG or JPEG",
  fileSizeLimit: 4.3,
};

function EditImage({
  image,
  handleData,
  aspectRatio,
}: {
  image: Image;
  handleData: (dataUrl: string) => void;
  aspectRatio?: number;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);
  return (
    <div className="relative">
      <Cropper
        src={image.url}
        style={{ height: 400, width: "100%" }}
        autoCropArea={1}
        aspectRatio={aspectRatio}
        ref={cropperRef}
      />
      <div
        className="btn absolute bottom-2 left-2 btn-success gap-2"
        onClick={() => {
          if (!cropperRef.current) return;
          const cropper = cropperRef.current.cropper;
          const imageData = cropper.getCroppedCanvas().toDataURL(image.type);
          handleData(imageData);
        }}
      >
        <HiCheckCircle />
        Confirm Crop
      </div>
    </div>
  );
}

function ImageSelect({
  handleSet,
  fileSizeLimit,
  title,
  info,
}: {
  title: string;
  info: string;
  fileSizeLimit?: number;
  handleSet: (data: any) => void;
}) {
  // calculate file size limit
  const infoText = fileSizeLimit ? `${info}, up to ${fileSizeLimit}MB` : info;
  return (
    <>
      <FieldHeader title={title} info={infoText} />
      <input
        type="file"
        accept="image/jpeg, image/png"
        className="file-input file-input-bordered w-full"
        onChange={(event) => {
          const file = event.target.files && event.target.files[0];
          if (!file) return;
          if (fileSizeLimit && file.size > fileSizeLimit * MB) {
            alert(
              `File is too big! Please upload a file less than ${fileSizeLimit}MB.`
            );
            return;
          }
          const url = URL.createObjectURL(file);
          handleSet({ url, type: file.type });
        }}
      />
    </>
  );
}

export default function ImageInput({
  name,
  aspectRatio,
  title = defaultInfo.title,
  info = defaultInfo.info,
  fileSizeLimit = defaultInfo.fileSizeLimit,
}: ImageInput) {
  const altTextName = `alt_text_${name}`;
  const [field, meta, helpers] = useField(name);
  const [, , altHelpers] = useField(altTextName);
  const [image, setImage] = useState<null | Image>(null);
  const isEditing = field.value === "editing";
  return (
    <div className="form-control relative">
      {/* FILE PICKER */}
      {!image && (
        <ImageSelect
          title={title}
          info={info}
          fileSizeLimit={fileSizeLimit}
          handleSet={(data) => {
            helpers.setValue("editing");
            setImage(data);
          }}
        />
      )}
      {/* REMOVE BUTTON */}
      {!!field.value && (
        <RemoveButton
          onClick={() => {
            setImage(null);
            altHelpers.setValue("");
            helpers.setValue("");
          }}
        />
      )}
      {/* CROP UI */}
      {isEditing && image && (
        <EditImage
          image={image}
          aspectRatio={aspectRatio}
          handleData={helpers.setValue}
        />
      )}
      {/* CROPPED IMAGE */}
      {field.value && !isEditing && (
        <>
          <div className="flex justify-center checkered rounded-md overflow-hidden border border-base-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={field.value} alt="Image Preview" />
          </div>
          <div className="-mt-2">
            <TextInput
              name={altTextName}
              placeholder="Optional image description"
            />
          </div>
        </>
      )}
      <FieldHeader error={meta.error} />
    </div>
  );
}
