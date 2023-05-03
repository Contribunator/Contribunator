"use client";

import { useRef, useState } from "react";
import { useField } from "formik";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

import TextInput from "./textInput";

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
    <div>
      <Cropper
        src={url}
        style={{ height: 400, width: "100%" }}
        autoCropArea={1}
        aspectRatio={aspectRatio}
        ref={cropperRef}
      />
      <div
        className="btn"
        onClick={() => {
          if (!cropperRef.current) return;
          const cropper = cropperRef.current.cropper;
          // TODO UI feedback
          const imageData = cropper.getCroppedCanvas().toDataURL();
          handleData(imageData);
        }}
      >
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
    <div>
      Upload up to {limit} image(s)
      <div>
        {imageFields
          .filter(({ show }) => show)
          .map((field) => (
            <ImageInput key={field.name} {...field} />
          ))}
      </div>
    </div>
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
    <div className="form-control my-2 py-2 bg-slate-400">
      {!imageUrl && <ImageSelect handleSet={setImageUrl} />}
      {(imageUrl || field.value) && (
        <div
          className="btn"
          onClick={() => {
            setImageUrl(null);
            altHelpers.setValue(null);
            helpers.setValue(null);
          }}
        >
          Change Image
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
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={field.value} alt="Image Preview" />
          <TextInput
            id={altTextName}
            placeholder="Optional Image Description"
          />
        </div>
      )}
    </div>
  );
}
