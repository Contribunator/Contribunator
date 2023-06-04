// infer type from data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
export default function getImageType(base64String: string) {
  const fileType = base64String.split(";")[0].split("/")[1];
  if (fileType === "png") {
    return fileType;
  }
  if (fileType === "jpeg" || fileType === "jpg") {
    return "jpg";
  }
  throw new Error("Invalid image data");
}
