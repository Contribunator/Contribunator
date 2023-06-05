import { useState } from "react";
import { NestedChoiceOptions, ChoiceCompProps } from "./choiceInput";

export default function ChoiceButtons({
  field,
  options,
  handleChange,
  unset,
}: ChoiceCompProps) {
  const [state, setState] = useState<string | null>(null);
  const currentValue = state || field.value;
  const subOptions = !!state && options[state]?.options;
  const mappedOptions =
    subOptions &&
    (Object.fromEntries(
      Object.entries(subOptions).map(([k, v]) => [`${state}.${k}`, v])
    ) as NestedChoiceOptions);

  return (
    <>
      <div className="btn-group flex bg-base-100 rounded-lg textarea textarea-bordered p-0">
        {unset && (
          <a
            className={`flex-1 btn btn-neutral ${
              currentValue ? "btn-ghost" : ""
            }`}
            onClick={() => {
              setState(null);
              handleChange(undefined);
            }}
          >
            {unset}
          </a>
        )}
        {Object.entries(options).map(([name, option]) => (
          <a
            key={name}
            className={`flex-1 btn btn-neutral ${
              currentValue !== name ? "btn-ghost" : ""
            }`}
            onClick={() => {
              if (option.options) {
                setState(name);
                handleChange(undefined);
              } else {
                setState(null);
                handleChange(name);
              }
            }}
          >
            {option.text}
          </a>
        ))}
      </div>
      {mappedOptions && (
        <div className="mt-2">
          <ChoiceButtons
            field={field}
            options={mappedOptions}
            handleChange={handleChange}
          />
        </div>
      )}
    </>
  );
}
