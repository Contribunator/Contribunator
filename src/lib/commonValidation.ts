import * as Yup from "yup";

export const ALT_TEXT = "alt_text_";

// TODO we an move this into generateSchema once twitter is updated
export function imageSchema(isArray?: boolean, label?: string) {
  let image = Yup.string();
  if (label) {
    image = image.label(label);
  }
  image = image.test({
    test(data = "", ctx) {
      if (data === "") {
        return true;
      }
      if (data === "editing") {
        return ctx.createError({
          message: "Please complete crop selection",
        });
      }
      if (
        data.match(
          /^data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
        )
      ) {
        return true;
      }
      return ctx.createError({
        message: "Invalid image data",
      });
    },
  });

  const alt = Yup.string().max(999, "Must be less than 1,000 characters");

  return {
    image: isArray ? Yup.array().of(image) : image,
    alt: isArray ? Yup.array().of(alt) : alt,
  };
}
