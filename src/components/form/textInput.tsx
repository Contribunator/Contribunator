import { Field, useField } from "formik";

import FieldHeader from "./fieldHeader";

// TODO move these types in to a config

export type TextInput = {
  title?: string;
  prefix?: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  info?: string;
  placeholder?: string;
  transform?: (value: string) => string;
  suggestions?: { has?: string; hasNo?: string; message: string }[];
  tags?: string[];
};

export default function TextInput({
  title,
  name,
  prefix,
  as = "input",
  info,
  transform,
  suggestions,
  placeholder,
  tags,
}: TextInput) {
  const [field, meta, helpers] = useField(name);
  const styles = [
    as === "input" && "input input-bordered",
    as === "textarea" && "textarea textarea-bordered h-32",
    prefix && "rounded-l-none border-l-0",
  ]
    .filter((a) => a)
    .join(" ");

  const currentSuggestions =
    meta.value &&
    suggestions
      ?.filter(({ has, hasNo }) => {
        if (!has && !hasNo) {
          return true;
        }
        const hasMatch = !has || new RegExp(has, "gu").test(meta.value);
        const hasNoMatch = !hasNo || !new RegExp(hasNo, "gu").test(meta.value);
        return hasMatch && hasNoMatch;
      })
      .map(({ message }) => message);
  return (
    <div className="form-control">
      <FieldHeader name={name} error={meta.error} title={title} info={info} />
      <div className="space-y-2">
        <div className="flex">
          {/* TODO use formgroup instead */}
          {prefix && (
            <div className="flex bg-base-300 items-center px-2 text-sm rounded-l-md select-none">
              {prefix}
            </div>
          )}
          <div className="flex-auto">
            <Field
              name={name}
              value={field.value || ""}
              as={as}
              className={`w-full ${styles}`}
              placeholder={placeholder}
              {...(transform && {
                onChange: (e: { target: { value: string } }) => {
                  helpers.setValue(transform(e.target.value));
                },
              })}
            />
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="text-left text-sm">
            {tags.map((tag) => (
              <div
                key={tag}
                className="inline-flex bg-base-100 cursor-pointer mr-1 rounded-md px-2 py-1 mb-1 hover:bg-base-300 select-none"
                onClick={() => {
                  helpers.setValue(`${field.value} ${tag}`);
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        {currentSuggestions && currentSuggestions.length > 0 && (
          <div className="text-xs text-secondary text-left">
            <b>Optional Suggestion: </b>
            {currentSuggestions.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
