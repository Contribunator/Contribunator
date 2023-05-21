import { Field, useField } from "formik";
import FieldHeader from "./fieldHeader";

export default function TextInput({
  title,
  name,
  prefix,
  as = "input",
  info,
  placeholder,
}: {
  title?: string;
  prefix?: string;
  name: string;
  type?: string;
  as?: null | "input" | "textarea";
  info?: string;
  placeholder?: string;
}) {
  const [, meta] = useField(name);
  const styles = [
    as === "input" && "input input-bordered",
    as === "textarea" && "textarea textarea-bordered h-32",
    prefix && "rounded-l-none border-l-0",
  ]
    .filter((a) => a)
    .join(" ");
  return (
    <div className="form-control">
      <FieldHeader name={name} error={meta.error} title={title} info={info} />
      <div className="flex">
        {prefix && (
          <div className="flex bg-base-300 items-center px-2 text-sm rounded-l-md select-none">
            {prefix}
          </div>
        )}
        <div className="flex-auto">
          <Field
            name={name}
            as={as}
            className={`w-full ${styles}`}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
}
