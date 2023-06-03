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
      {/* ignore validation options here, everything else gets passed */}
      {Object.entries(fields).map(([name, { validation, ...field }]) => {
        const Input = components[field.type];
        // TODO do not ignore typescript
        // @ts-ignore
        return <Input key={name} name={name} {...field} />;
      })}
      {<pre>{JSON.stringify(formik.values, null, 2)}</pre>}
    </>
  );
}

export default withFormik(GenericFormContent);
