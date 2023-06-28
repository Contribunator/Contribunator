import { Fields } from "@/types";

// Image
/*
fileSizeLimit?: number;
alt?: boolean | string;
info?: string;
aspectRatio?: number;
*/

// Images
/*
  limit?: number;
  totalFileSizeLimit?: number;
*/

const imageFieldTest: Fields = {
  infoImage: {
    type: "info",
    title: "Single Image Upload",
  },
  imageBasic: {
    type: "image",
    title: "Basic Image",
  },
  imageFull: {
    type: "image",
    title: "Image with full options",
    fileSizeLimit: 0.5,
    alt: "Alt text",
    info: "Info here",
    aspectRatio: 1,
    validation: { required: true },
  },
  infoImages: {
    type: "info",
    title: "Multiple Images Upload (Limits total filesize)",
  },
  imagesBasic: {
    type: "images",
    title: "Basic Images",
  },
  imagesFull: {
    type: "images",
    title: "Images with full options",
    alt: "Alt text",
    info: "Info here",
    aspectRatio: 1,
    totalFileSizeLimit: 1,
    validation: { required: true, min: 2, max: 3 },
  },
};

export default imageFieldTest;
