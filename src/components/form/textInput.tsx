import { Field, useField } from "formik";
import FieldHeader from "./fieldHeader";

// TODO fix the controlled field error

export default function TextInput({
  title,
  name,
  as = "input",
  info,
  placeholder,
}: {
  title?: string;
  name: string;
  type?: string;
  as?: null | "input" | "textarea";
  info?: string;
  placeholder?: string;
}) {
  const [, meta] = useField(name);
  const styles = [
    meta.error && "input-error",
    as === "input" && "input input-bordered",
    as === "textarea" && "textarea textarea-bordered h-32",
  ]
    .filter((a) => a)
    .join(" ");
  return (
    <div className="form-control">
      <FieldHeader name={name} error={meta.error} title={title} info={info} />
      <Field
        name={name}
        as={as}
        className={`w-full ${styles}`}
        placeholder={placeholder}
      />
    </div>
  );
}
