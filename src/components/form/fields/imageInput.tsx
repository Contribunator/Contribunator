import { useRef } from "react";
import { useField } from "formik";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

import { HiCheckCircle } from "react-icons/hi";

import FieldHeader from "../common/fieldHeader";
import RemoveButton from "../common/removeButton";

import TextInput from "./textInput";

export type Props = {
  fileSizeLimit?: number;
  title?: string;
  name: string;
  alt?: boolean | string;
  info?: string;
  aspectRatio?: number;
};

export type Image = {
  data?: string;
  type?: string;
  editing?: string;
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
  handleData: (data: string) => void;
  aspectRatio?: number;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);
  return (
    <div className="relative">
      <Cropper
        src={image.editing}
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
          const imageType = image.type === "png" ? "image/png" : "image/jpeg";
          const imageData = cropper.getCroppedCanvas().toDataURL(imageType);
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
  handleSet: (param: { data: string; type: string }) => void;
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
          const data = URL.createObjectURL(file);
          const type = file.type.split("/")[1];
          handleSet({ data, type });
        }}
      />
    </>
  );
}

export default function ImageInput({
  name,
  alt,
  aspectRatio,
  title = defaultInfo.title,
  info = defaultInfo.info,
  fileSizeLimit = defaultInfo.fileSizeLimit,
  handleRemove,
  showErrors = true,
}: Props & { showErrors?: boolean; handleRemove?: () => void }) {
  const [field, meta, helpers] = useField(name);
  const image = field.value || {};
  return (
    <div className="form-control">
      {/* FILE PICKER */}
      {!image.data && !image.editing && (
        <ImageSelect
          title={title}
          info={info}
          fileSizeLimit={fileSizeLimit}
          handleSet={({ data, type }) => {
            helpers.setValue({ editing: data, type });
          }}
        />
      )}
      {/* EDITING */}
      {(image.data || image.editing) && (
        <>
          {!handleRemove && <FieldHeader title={title} />}
          <div className="relative">
            {/* REMOVE BUTTON */}
            {!!field.value && (
              <RemoveButton
                onClick={() => {
                  if (handleRemove) {
                    handleRemove();
                  } else {
                    helpers.setValue(undefined);
                  }
                }}
              />
            )}
            {/* CROP UI */}
            {image.editing && (
              <EditImage
                image={image}
                aspectRatio={aspectRatio}
                handleData={(data) =>
                  helpers.setValue({ data, type: image.type })
                }
              />
            )}
            {/* CROPPED IMAGE */}
            {image.data && (
              <>
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.data}
                    alt="Image Preview"
                    className="rounded-md checkered border border-base-300"
                  />
                </div>
                {/* ALT TEXT */}
                {!!alt && (
                  <div className="mt-1">
                    <TextInput
                      name={`${name}.alt`}
                      placeholder={
                        typeof alt === "string" ? alt : "Image Description"
                      }
                    />
                  </div>
                )}
              </>
            )}
            {showErrors && <FieldHeader error={meta.error} />}
          </div>
        </>
      )}
    </div>
  );
}
