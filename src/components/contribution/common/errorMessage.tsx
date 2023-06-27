export type MixedErrorMessage = any;

// formik / yup will pass a bunch of different types of errors
// so we need to parse them into a string

function flattenErrors(error: MixedErrorMessage): string[] {
  let errors: string[] = [];
  if (Array.isArray(error)) {
    error.forEach((item) => {
      if (typeof item === "string") {
        errors.push(item);
      } else {
        errors = [...errors, ...error.map(flattenErrors).flat()];
      }
    });
  } else if (typeof error === "object") {
    errors = [...errors, ...Object.values(error).map(flattenErrors).flat()];
  }
  if (typeof error === "string" && error.length > 1) {
    errors.push(error);
  }
  return errors.filter((s) => !!s);
}

export default function ErrorMessage({ error }: { error: MixedErrorMessage }) {
  if (!error) return null;
  const errors = flattenErrors(error);
  if (errors.length === 0) return null;
  return (
    <span className="label-text-alt text-error text-right">
      {errors[errors.length - 1]}
    </span>
  );
}
