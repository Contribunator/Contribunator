import { useField } from "formik";
import { HiPlus } from "react-icons/hi";

import { Fields } from "@/contributions/generic/config";
import GenericFormItems from "@/contributions/generic/formItems";
import FieldHeader from "./fieldHeader";
import RemoveButton from "./removeButton";

export type CollectionInput = {
  type: "collection";
  name: string;
  title: string;
  limit?: number;
  showAtLeast?: number;
  fields: Fields;
  info?: string;
  infoLink?: string;
  addButton?: boolean | string;
};

export default function CollectionInput({
  limit,
  showAtLeast = 1,
  title,
  fields,
  name,
  info,
  infoLink,
  addButton,
}: CollectionInput) {
  const [field, meta, helpers] = useField(name);

  const collection = field?.value || [];
  const items =
    showAtLeast > collection.length + 1 ? showAtLeast : collection.length + 1;
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
      <div className="form-control space-y-2">
        <FieldHeader
          name={name}
          title={title && `${title}${remaining}`}
          error={meta.error}
          info={info}
          infoLink={infoLink}
        />
        <div className="flex flex-col space-y-4">
          {childFields.map((childField, i) => {
            const key = `${name}.${i}`;
            const hasValue = collection[i];
            if (!hasValue && addButton && i > 0 && i > showAtLeast - 1) {
              return (
                <div
                  key={key}
                  className="btn gap-2 bg-white"
                  onClick={() => {
                    // append a new empty object
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
                className={`relative rounded-md bg-base-100 bg-opacity-50 space-y-4 -m-2 p-2 ${
                  hasValue
                    ? "opacity-100"
                    : "opacity-50 hover:opacity-100 focus:opacity-100 transition-all first:opacity-100"
                }`}
              >
                <GenericFormItems fields={childField} />
                {hasValue && (
                  <RemoveButton
                    className="btn-xs -top-6 right-2"
                    onClick={() => {
                      // remove current index from array
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
    </>
  );
}
