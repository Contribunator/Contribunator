import { HiChevronDown, HiChevronLeft } from "react-icons/hi";

import { ChoiceCompProps, NestedChoiceOptions } from "./choiceInput";
import { ValidationTypes } from "@/types";

function DropdownItems({
  parent,
  options,
  value,
  handleChange,
}: {
  parent?: string;
  options: NestedChoiceOptions;
  value: string | string[] | undefined;
  multiple?: boolean;
  handleChange: (value: string | undefined) => void;
}) {
  return (
    <>
      {Object.entries(options).map(([key, { icon: Icon, ...option }]) => {
        const parentKey = parent ? `${parent}.${key}` : key;
        const isSelected = (Array.isArray(value) ? value : [value]).includes(
          parentKey
        );
        return (
          <li key={key}>
            {!option.options && (
              <a
                onClick={() => handleChange(parentKey)}
                className={`gap-2 ${isSelected ? "active" : ""}`}
              >
                {Icon && <Icon />}
                {option.title}
              </a>
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
  const selectedOptions =
    field.value &&
    (Array.isArray(field.value) ? field.value : [field.value])
      .map((value) =>
        value.split(".").reduce(
          // @ts-ignore
          (acc, cur) => acc[cur] && (acc[cur].options || acc[cur].title),
          options
        )
      )
      .join(", ");
  return (
    <div className="flex items-center space-x-2">
      <div className="dropdown">
        {/* displayed when selecting */}
        <label tabIndex={0} className="btn btn-neutral gap-2">
          {selectedOptions || unset || "No Selection"}
          <HiChevronDown className="w-5 h-5" />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box mt-1 z-10"
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
