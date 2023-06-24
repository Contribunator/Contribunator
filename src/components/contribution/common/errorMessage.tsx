export type MixedErrorMessage = any;

// formik / yup will pass a bunch of different types of errors
// so we need to parse them into a string

export default function ErrorMessage({ error }: { error: MixedErrorMessage }) {
  if (!error) return null;
  let errors = [];
  if (Array.isArray(error)) {
    error.forEach((item) => {
      if (typeof item === "string") {
        errors.push(item);
      } else {
        errors.push(Object.values(item).join(","));
      }
    });
  } else if (typeof error === "object") {
    errors.push(Object.values(error).pop());
  }
  if (typeof error === "string" && error.length > 1) {
    errors.push(error);
  }
  if (errors.length === 0) return null;
  return (
    <span className="label-text-alt text-error text-right">
      {errors.join(", ")}
    </span>
  );
}
