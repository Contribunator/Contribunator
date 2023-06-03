import * as Yup from "yup";

export const ALT_TEXT = "alt_text_";

export const validImage = Yup.string().test({
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

export const validImageAlt = Yup.string().max(
  999,
  "Must be less than 1,000 characters"
);

export const validImages = Yup.array().of(validImage);
export const validImageAlts = Yup.array().of(validImageAlt);
