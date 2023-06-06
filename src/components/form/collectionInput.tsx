import { useField } from "formik";
import { HiOutlineInformationCircle, HiPlus } from "react-icons/hi";

import { Fields } from "@/contributions/generic/config";
import GenericFormItems from "@/contributions/generic/formItems";
import FieldHeader from "./fieldHeader";
import RemoveButton from "./removeButton";

export type CollectionInput = {
  type: "collection";
  name: string;
  title: string;
  limit?: number;
  fields: Fields;
  info?: string;
  addButton?: boolean | string;
};

export default function CollectionInput({
  limit = 5,
  title,
  fields,
  name,
  info,
  addButton,
}: CollectionInput) {
  const [field, meta, helpers] = useField(name);

  const collection = field?.value || [];
  const items = collection.length + 1;
  const showItems = limit && items > limit ? limit : items;

  const childFields: Fields[] = [];
  for (let i = 0; i < showItems; i++) {
    const childField: Fields = {};
    Object.entries(fields).forEach(([key, child]) => {
      childField[`${name}[${i}].${key}`] = child;
    });
    childFields.push(childField);
  }

  const remaining = limit ? ` (${limit + 1 - items} remaining)` : "";

  return (
    <>
      <div className="form-control">
        <FieldHeader
          name={name}
          title={`${title}${remaining}`}
          error={meta.error}
          info={info}
        />
        <div className="flex flex-col space-y-2">
          {childFields.map((childField, i) => {
            const key = `${name}.${i}`;
            const hasValue = collection[i];
            if (!hasValue && addButton && i > 0) {
              // set to an empty object
              return (
                <div
                  key={key}
                  className="btn gap-2 bg-white"
                  onClick={() => {
                    helpers.setValue([...collection, {}]);
                  }}
                >
                  {addButton === true ? "Add Item" : addButton}
                  <HiPlus />
                </div>
              );
            }
            return (
              <div
                key={key}
                className={`relative rounded-md bg-base-100 bg-opacity-40 space-y-4 p-2 ${
                  hasValue
                    ? "opacity-100"
                    : "opacity-50 hover:opacity-100 focus:opacity-100 transition-all first:opacity-100"
                }`}
              >
                <GenericFormItems fields={childField} />
                {hasValue && (
                  <RemoveButton
                    className="btn-xs -top-3 right-1"
                    onClick={() => {
                      const newValues = [...collection];
                      newValues.splice(i, 1);
                      helpers.setValue(newValues);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <pre>{JSON.stringify({ name, childFields, field }, null, 2)}</pre>
    </>
  );
}
