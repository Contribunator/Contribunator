import React, { useState } from "react";

import { NestedChoiceOptions, ChoiceCompProps } from "./choiceInput";

function Unset({
  unset,
  value,
  handleChange,
  inline,
}: Pick<ChoiceCompProps, "unset" | "handleChange"> & {
  value: string | string[] | undefined;
  inline?: boolean;
}) {
  if (!unset) {
    return null;
  }
  const color = value ? (inline ? "bg-white" : "btn-ghost") : "bg-base-300";
  return (
    <a
      data-selected={!value ? true : undefined}
      className={`btn flex-1 ${color} ${inline ? "mr-2" : ""}`}
      onClick={() => {
        handleChange(undefined);
      }}
    >
      {unset}
    </a>
  );
}

function Button({
  onClick,
  Icon,
  title,
  value,
  name,
  className,
  hasChildren,
}: {
  onClick: () => void;
  title?: string;
  name: string;
  Icon?: React.FC;
  value: string | string[] | undefined;
  className?: string;
  hasChildren?: boolean;
}) {
  const isSelected = (Array.isArray(value) ? value : [value]).includes(name);
  const color = isSelected
    ? hasChildren
      ? "bg-base-300"
      : "btn-neutral"
    : "btn-ghost bg-base-100";
  return (
    <a
      data-selected={isSelected && !hasChildren ? true : undefined}
      className={`flex-1 btn ${color} ${className ? className : ""}`}
      onClick={onClick}
    >
      {Icon && <Icon />}
      {title}
    </a>
  );
}

function ChoiceButtonsGroup({
  field,
  options,
  handleChange,
  unset,
}: ChoiceCompProps) {
  // TODO only use state if we have suboptions
  const [state, setState] = useState<string | null>(null);
  const value = state || field.value;
  const subOptions = !!state && options[state]?.options;
  const mappedOptions =
    subOptions &&
    (Object.fromEntries(
      Object.entries(subOptions).map(([k, v]) => [`${state}.${k}`, v])
    ) as NestedChoiceOptions);
  return (
    <>
      <div className="btn-group flex rounded-lg textarea textarea-bordered p-0">
        <Unset
          {...{
            unset,
            value,
            handleChange: () => {
              setState(null);
              handleChange(undefined);
            },
          }}
        />
        {Object.entries(options).map(([name, { icon, ...option }]) => (
          <Button
            key={name}
            Icon={icon}
            title={option.title}
            hasChildren={!!option.options}
            value={value}
            name={name}
            onClick={() => {
              if (option.options) {
                setState(name);
                handleChange(undefined);
              } else {
                setState(null);
                handleChange(name);
              }
            }}
          />
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

function ChoiceButtonsInlineItems({
  field: { value },
  options,
  handleChange,
  parentKey,
}: ChoiceCompProps & { parentKey?: string }) {
  return (
    <>
      {Object.entries(options).map(([name, { icon, ...option }]) => {
        const thisKey = parentKey ? `${parentKey}.${name}` : name;
        if (option.options) {
          return (
            <div
              key={name}
              className="block my-2 bg-base-100 bg-opacity-30 rounded-lg p-2"
            >
              <div className="mb-2 px-1 text-sm text-neutral-600">
                {option.title}
              </div>
              <div>
                <ChoiceButtonsInlineItems
                  field={{ value }}
                  options={option.options}
                  parentKey={thisKey}
                  handleChange={handleChange}
                />
              </div>
            </div>
          );
        }
        return (
          <Button
            className="mr-2 mb-2"
            key={name}
            Icon={icon}
            title={option.title}
            value={value}
            name={thisKey}
            onClick={() => {
              handleChange(thisKey);
            }}
          />
        );
      })}
    </>
  );
}
function ChoiceButtonsInline(props: ChoiceCompProps) {
  const {
    field: { value },
    handleChange,
    unset,
  } = props;

  return (
    <div className="text-left">
      <Unset {...{ unset, value, handleChange }} inline />
      <ChoiceButtonsInlineItems {...props} />
    </div>
  );
}

export default function ChoiceButtons({
  inline,
  multiple,
  ...props
}: ChoiceCompProps) {
  if (inline || multiple) {
    return <ChoiceButtonsInline {...props} />;
  }
  return <ChoiceButtonsGroup {...props} />;
}
