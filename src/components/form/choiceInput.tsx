import { useField } from "formik";
import { HiChevronDown, HiChevronLeft } from "react-icons/hi";

import FieldHeader from "./fieldHeader";

export type ChoiceInput = {
  name: string;
  title?: string;
  unset?: string;
  info?: string;
  options: { [key: string]: { text: string } };
  component?: "dropdown" | "buttons";
};

type CompProps = ChoiceInput & {
  handleChange: (value: string | undefined) => void;
  field: { value: string };
};

// TODO, only show unselect when not required.
function Dropdown({
  handleChange,
  field,
  options,
  unset = "No Selection",
  info,
}: CompProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="dropdown">
        <label tabIndex={0} className="btn gap-2">
          {options[field.value]?.text || unset}
          <HiChevronDown />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1"
        >
          {!!field.value && (
            <li>
              <a onClick={() => handleChange(undefined)}>{unset}</a>
            </li>
          )}
          {Object.keys(options)
            .filter((name) => name !== field.value)
            .map((name) => (
              <li key={name}>
                <a onClick={() => handleChange(name)}>{options[name].text}</a>
              </li>
            ))}
        </ul>
      </div>
      {info && !field.value && (
        <label className="label label-text">
          <HiChevronLeft className="mr-1" />
          {info}
        </label>
      )}
    </div>
  );
}

function Buttons({ field, options, handleChange, unset }: CompProps) {
  // add option to show buttons instead of dropdown
  return (
    <div className="btn-group flex bg-base-100 rounded-lg textarea textarea-bordered p-0">
      {unset && (
        <a
          className={`flex-1 btn ${field.value ? "btn-ghost" : ""}`}
          onClick={() => handleChange(undefined)}
        >
          {unset}
        </a>
      )}
      {Object.keys(options).map((name) => (
        <a
          key={name}
          className={`flex-1 btn ${field.value !== name ? "btn-ghost" : ""}`}
          onClick={() => handleChange(name)}
        >
          {options[name].text}
        </a>
      ))}
    </div>
  );
}

export default function ChoiceInput(props: ChoiceInput) {
  // todo option to show buttons instead of dropdown
  const { name, component = "dropdown" } = props;
  const [field, meta, helpers] = useField(name);
  function handleChange(value: string | undefined) {
    (document.activeElement as HTMLElement)?.blur();
    helpers.setValue(value);
  }
  return (
    <div className="form-control">
      <FieldHeader {...{ ...props, ...meta }} />
      {component === "dropdown" && (
        <Dropdown {...props} field={field} handleChange={handleChange} />
      )}
      {component === "buttons" && (
        <Buttons {...props} field={field} handleChange={handleChange} />
      )}
    </div>
  );
}
