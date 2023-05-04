"use client";

import { useRef, useState } from "react";
import { useField } from "formik";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

import TextInput from "./textInput";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

type Props = {};

function EditImage({
  url,
  handleData,
  aspectRatio,
}: {
  url: string;
  handleData: (dataUrl: string) => void;
  aspectRatio?: number;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);
  return (
    <div className="relative">
      <Cropper
        src={url}
        style={{ height: 400, width: "100%" }}
        autoCropArea={1}
        aspectRatio={aspectRatio}
        ref={cropperRef}
      />
      <div
        className="btn absolute bottom-2 left-2 btn-success"
        onClick={() => {
          if (!cropperRef.current) return;
          const cropper = cropperRef.current.cropper;
          // TODO UI feedback
          const imageData = cropper.getCroppedCanvas().toDataURL();
          handleData(imageData);
        }}
      >
        <HiCheckCircle className="mr-2" />
        Confirm Crop
      </div>
    </div>
  );
}

function ImageSelect({ handleSet }: { handleSet: (imageUrl: string) => void }) {
  return (
    <>
      <label className="label">
        <span className="label-text">Upload an Image</span>
        <span className="label-text-alt">JPEG and PNG supported</span>
      </label>
      <input
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        className="file-input file-input-bordered w-full"
        onChange={(event) => {
          if (!event.target.files?.length) return;
          if (event.target.files[0].size > 1048576) {
            alert("File is too big! Please upload a file less than 1MB.");
            return;
          }
          handleSet(URL.createObjectURL(event.target.files[0]));
        }}
      />
    </>
  );
}

export function ImagesInput({ name, limit }: { name: string; limit: number }) {
  const [field] = useField(name);
  const values = field.value || [];
  let firstEmptySlot = 0;
  const imageFields = new Array(limit).fill(null).map((_, i) => {
    const exists = values[i] && values[i] !== null;
    if (!exists && !firstEmptySlot) {
      firstEmptySlot = i + 1;
    }
    return {
      name: `${name}[${i}]`,
      show: exists || i + 1 === firstEmptySlot,
    };
  });
  return (
    <>
      {imageFields
        .filter(({ show }) => show)
        .map((field) => (
          <ImageInput key={field.name} {...field} />
        ))}
    </>
  );
}

export default function ImageInput({
  name,
  aspectRatio,
}: {
  name: string;
  aspectRatio?: number;
}) {
  const altTextName = `alt_text_${name}`;
  const [field, , helpers] = useField(name);
  const [, , altHelpers] = useField(altTextName);
  const [imageUrl, setImageUrl] = useState<null | string>(null);

  return (
    <div className="form-control relative bg-slate-300 rounded-md p-2">
      {!imageUrl && <ImageSelect handleSet={setImageUrl} />}
      {(imageUrl || field.value) && (
        <div
          className="btn btn-sm btn-error absolute top-4 right-4 z-10"
          onClick={() => {
            setImageUrl(null);
            altHelpers.setValue(null);
            helpers.setValue(null);
          }}
        >
          <HiXCircle className="mr-2" /> Remove
        </div>
      )}
      {imageUrl && !field.value && (
        <>
          <EditImage
            url={imageUrl}
            aspectRatio={aspectRatio}
            handleData={helpers.setValue}
          />
        </>
      )}
      {/* TODO option to enter media name */}
      {field.value && (
        <>
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={field.value}
              alt="Image Preview"
              className="m-0 rounded-md"
            />
          </div>
          <div className="-mt-2">
            <TextInput id={altTextName} placeholder="Optional Description" />
          </div>
        </>
      )}
    </div>
  );
}
