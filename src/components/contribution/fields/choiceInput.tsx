import { useField } from "formik";

import type { ValidationTypes } from "@/types";

import FieldHeader from "../common/fieldHeader";

import ChoiceDropdown from "./choiceDropdown";
import ChoiceButtons from "./choiceButtons";
import React from "react";

type ChoiceOption = {
  title?: string;
  icon?: React.FC;
  options?: NestedChoiceOptions;
};

export type NestedChoiceOptions = {
  [key: string]: ChoiceOption;
};

export type Props = {
  name: string;
  title?: string;
  unset?: string;
  info?: string;
  multiple?: boolean;
  options: NestedChoiceOptions;
  validation?: ValidationTypes;
  as?: "dropdown" | "buttons" | "buttons-inline";
};

export type ChoiceCompProps = Omit<Props, "name"> & {
  handleChange: (value: string | undefined) => void;
  field: { value?: string | string[] };
  inline?: boolean;
};

export default function ChoiceInput(props: Props) {
  const { multiple, validation, name } = props;
  const [field, meta, helpers] = useField(name);
  const inline = props.as == "buttons-inline";
  const as = inline ? "buttons" : props.as || "dropdown";
  const unset =
    props.unset ||
    (!multiple && !validation?.required ? "No Selection" : undefined);
  function handleChange(value: string | undefined) {
    if (!multiple) {
      (document.activeElement as HTMLElement)?.blur();
      helpers.setValue(value);
    } else {
      if (!value) {
        helpers.setValue(undefined);
      } else {
        const values = field.value || [];
        if (values.includes(value)) {
          const newValues = values.filter((v: string) => v !== value);
          helpers.setValue(newValues.length ? newValues : undefined);
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
        <ChoiceDropdown
          {...props}
          unset={unset}
          field={field}
          handleChange={handleChange}
        />
      )}
      {as === "buttons" && (
        <ChoiceButtons
          {...props}
          inline={inline}
          unset={unset}
          field={field}
          handleChange={handleChange}
        />
      )}
    </div>
  );
}
