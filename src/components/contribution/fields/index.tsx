import type { ReactElement } from "react";
import { useFormikContext } from "formik";

import type { Field as FieldBase, Fields, FormikContext } from "@/types";

// this causes weird page loading issues
// instead, load heavy libraries within the component (e.g. image)
// import dynamic from "next/dynamic";
// const components = {
//   text: dynamic(() => import("./textInput")),
//   choice: dynamic(() => import("./choiceInput")),
//   image: dynamic(() => import("./imageInput")),
//   images: dynamic(() => import("./imagesInput")),
//   info: dynamic(() => import("./infoField")),
//   collection: dynamic(() => import("./collectionInput")),
// };

import TextInput from "./textInput";
import ChoiceInput from "./choiceInput";
import ImageInput from "./imageInput";
import ImagesInput from "./imagesInput";
import InfoField from "./infoField";
import CollectionInput from "./collectionInput";

const components = {
  text: TextInput,
  choice: ChoiceInput,
  image: ImageInput,
  images: ImagesInput,
  info: InfoField,
  collection: CollectionInput,
};

type Field = FieldBase & { name: string };

type VisibilityProps = {
  field: Field;
  children: ReactElement | null;
};

// fetch values for visible method
function RenderWhenVisible({ field, children }: VisibilityProps) {
  const formik = useFormikContext() as FormikContext;
  const visible = field.visible && field.visible({ formik, field });
  if (!visible) return null;
  return children;
}

// show early if visibility method not defined
function VisibilityCheck({ field, children }: VisibilityProps) {
  if (!field.visible) return children;
  // otherwise do the more expensive check
  return <RenderWhenVisible field={field}>{children}</RenderWhenVisible>;
}

export default function FormFields({ fields }: { fields: Fields }) {
  return (
    <>
      {Object.entries(fields).map(([name, val]) => {
        const field = { name, ...val } as Field;
        // TODO
        // @ts-ignore
        const Input = components[field.type];
        return (
          <VisibilityCheck key={name} field={field}>
            {/* TODO fix this, typescript? */}
            {/* @ts-ignore */}
            <Input {...field} />
          </VisibilityCheck>
        );
      })}
    </>
  );
}
