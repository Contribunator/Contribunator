import { useField } from "formik";

import FieldHeader from "./fieldHeader";
import ChoiceDropdown from "./choiceDropdown";
import ChoiceButtons from "./choiceButtons";

type ChoiceOption = {
  title: string;
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
  options: NestedChoiceOptions;
  as?: "dropdown" | "buttons";
};

export type ChoiceCompProps = Omit<ChoiceInput, "name"> & {
  handleChange: (value: string | undefined) => void;
  field: { value: string };
};

export default function ChoiceInput(props: ChoiceInput) {
  // todo option to show buttons instead of dropdown
  const { name, as = "dropdown" } = props;
  const [field, meta, helpers] = useField(name);
  function handleChange(value: string | undefined) {
    (document.activeElement as HTMLElement)?.blur();
    helpers.setValue(value);
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
