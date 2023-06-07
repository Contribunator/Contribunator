import { useField } from "formik";

import FieldHeader from "./fieldHeader";
import ChoiceDropdown from "./choiceDropdown";
import ChoiceButtons from "./choiceButtons";
import React from "react";

type ChoiceOption = {
  title?: string;
  icon?: React.FC<any>;
  options?: NestedChoiceOptions;
};

export type NestedChoiceOptions = {
  [key: string]: ChoiceOption;
};

export type ChoiceInput = {
  name: string;
  title?: string;
  unset?: string;
  info?: string;
  multiple?: boolean;
  options: NestedChoiceOptions;
  as?: "dropdown" | "buttons";
};

export type ChoiceCompProps = Omit<ChoiceInput, "name"> & {
  handleChange: (value: string | undefined) => void;
  field: { value?: string | string[] };
};

export default function ChoiceInput(props: ChoiceInput) {
  // todo option to show buttons instead of dropdown
  const { multiple, name, as = "dropdown" } = props;
  const [field, meta, helpers] = useField(name);
  function handleChange(value: string | undefined) {
    if (!multiple) {
      (document.activeElement as HTMLElement)?.blur();
      helpers.setValue(value);
    } else {
      if (!value) {
        helpers.setValue(null);
      } else {
        const values = field.value || [];
        if (values.includes(value)) {
          const newValues = values.filter((v: string) => v !== value);
          helpers.setValue(newValues.length ? newValues : null);
        } else {
          helpers.setValue([...values, value]);
        }
      }
    }
  }
  return (
    <div className="form-control">
      <FieldHeader {...{ ...props, ...meta }} />
      {as === "dropdown" && (
        <ChoiceDropdown {...props} field={field} handleChange={handleChange} />
      )}
      {as === "buttons" && (
        <ChoiceButtons {...props} field={field} handleChange={handleChange} />
      )}
    </div>
  );
}
