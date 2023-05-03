"use client";

import { useRef, useState } from "react";
import { useField } from "formik";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

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
          handleSet(URL.createObjectURL(event.target.files[0]));
        }}
      />
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
  const [field, meta, helpers] = useField(name);
  const [imageUrl, setImageUrl] = useState<null | string>(null);

  return (
    <div className="form-control">
      {!imageUrl && <ImageSelect handleSet={setImageUrl} />}
      {(imageUrl || field.value) && (
        <div
          className="btn"
          onClick={() => {
            setImageUrl(null);
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
      {field.value && (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={field.value} alt="Image Preview" />
        </div>
      )}
    </div>
  );
}
