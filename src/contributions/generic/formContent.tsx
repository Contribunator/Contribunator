"use client";

import withFormik, { FormProps } from "@/components/form/withFormik";
import { GenericConfig } from "./config";
import TextInput from "@/components/form/textInput";
import ChoiceInput from "@/components/form/choiceInput";
import ImageInput from "@/components/form/imageInput";
import ImagesInput from "@/components/form/imagesInput";

const components = {
  text: TextInput,
  choice: ChoiceInput,
  image: ImageInput,
  images: ImagesInput,
};

function GenericFormContent({
  formik,
  // files,
  config: { contribution },
}: FormProps) {
  const {
    options: { fields },
  } = contribution as GenericConfig; // TODO figure out how to get the right type
  return (
    <>
      {Object.entries(fields).map(
        ([name, { validation, visible, type, ...field }]) => {
          const Input = components[type];
          if (visible && !visible(formik.values)) {
            return null;
          }
          // TODO do not ignore typescript
          // @ts-ignore
          return <Input key={name} name={name} {...field} />;
        }
      )}
    </>
  );
}

export default withFormik(GenericFormContent);
