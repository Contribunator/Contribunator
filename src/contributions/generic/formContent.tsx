"use client";

import withFormik, { FormProps } from "@/components/form/withFormik";
import { GenericConfig } from "./config";
import TextInput from "@/components/form/textInput";
import ChoiceInput from "@/components/form/choiceInput";
import ImageInput from "@/components/form/imageInput";
import ImagesInput from "@/components/form/imagesInput";
import { HiOutlineInformationCircle } from "react-icons/hi";

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
      {Object.entries(fields).map(([name, field]) => {
        const { type, visible } = field;
        if (visible && !visible(formik.values)) {
          return null;
        }
        if (field.type === "info") {
          return (
            <div
              className="flex text-sm text-secondary my-10 items-center justify-center gap-2"
              key={name}
            >
              <div>
                <HiOutlineInformationCircle className="h-5 w-5" />
              </div>
              <div className="text-left">{field.text}</div>
            </div>
          );
        }
        // TODO do not ignore typescript?
        // @ts-ignore
        const Input = components[type];
        return <Input key={name} name={name} {...field} />;
      })}
    </>
  );
}

export default withFormik(GenericFormContent);
