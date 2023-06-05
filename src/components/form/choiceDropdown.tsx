import { HiChevronDown, HiChevronLeft } from "react-icons/hi";
import { ChoiceCompProps, NestedChoiceOptions } from "./choiceInput";

function DropdownItems({
  parent,
  options,
  value,
  handleChange,
}: {
  parent?: string;
  options: NestedChoiceOptions;
  value: string;
  handleChange: (value: string | undefined) => void;
}) {
  return (
    <>
      {Object.entries(options).map(([key, option]) => {
        const parentKey = parent ? `${parent}.${key}` : key;
        return (
          <li key={key}>
            {!option.options && (
              <a onClick={() => handleChange(parentKey)}>{option.title}</a>
            )}
            {!!option.options && (
              <details>
                <summary>{option.title}</summary>
                <ul>
                  <DropdownItems
                    {...{
                      parent: parentKey,
                      options: option.options,
                      value,
                      handleChange,
                    }}
                  />
                </ul>
              </details>
            )}
          </li>
        );
      })}
    </>
  );
}

// TODO, only show unselect when not required.
export default function ChoiceDropdown({
  handleChange,
  field,
  options,
  unset,
  info,
}: ChoiceCompProps) {
  const selectedOption = field.value.split(".").reduce(
    // @ts-ignore
    (acc, cur) => acc[cur] && (acc[cur].options || acc[cur].title),
    options
  );
  return (
    <div className="flex items-center space-x-2">
      <div className="dropdown z-10">
        {/* displayed when selecting */}
        <label tabIndex={0} className="btn btn-neutral gap-2">
          {selectedOption || unset || "No Selection"}
          <HiChevronDown className="w-5 h-5" />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box mt-1"
        >
          {/* option to unset */}
          {!!field.value && !!unset && (
            <li>
              <a onClick={() => handleChange(undefined)}>{unset}</a>
            </li>
          )}
          {/* selection items */}
          <DropdownItems {...{ options, value: field.value, handleChange }} />
        </ul>
      </div>
      {info && !field.value && (
        <label className="label label-title">
          <HiChevronLeft className="mr-1" />
          {info}
        </label>
      )}
    </div>
  );
}
