import { Field, useField } from "formik";

export default function TextInput({
  title,
  id,
  as = "input",
  type = "text",
  info,
  placeholder,
}: {
  title: string;
  id: string;
  type?: string;
  as?: null | "input" | "textarea";
  info?: string;
  placeholder?: string;
}) {
  const [field, meta] = useField(id);
  const hasError = meta.error && meta.touched;
  const styles = [
    hasError && "input-error",
    as === "input" && "input input-bordered",
    as === "textarea" && "textarea textarea-bordered h-32",
  ]
    .filter((a) => a)
    .join(" ");
  return (
    <div className="form-control">
      <label className="label" htmlFor={id}>
        <span className="label-text">{title}</span>
        {!!hasError && (
          <span className="label-text-alt text-error">{meta.error}</span>
        )}
      </label>
      <Field
        name={id}
        type={type}
        as={as}
        className={`w-full ${styles}`}
        placeholder={placeholder}
      />
      {info && (
        <label className="label">
          <span className="label-text-alt">{info}</span>
        </label>
      )}
    </div>
  );
}
