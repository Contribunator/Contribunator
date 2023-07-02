import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Image } from "./imageInput";
import { useRef } from "react";
import { HiCheckCircle } from "react-icons/hi";

export default function EditImage({
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
        className="btn absolute bottom-2 left-2 btn-success"
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
