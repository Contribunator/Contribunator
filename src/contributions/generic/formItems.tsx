import { Fields } from "./config";

import TextInput from "@/components/form/textInput";
import ChoiceInput from "@/components/form/choiceInput";
import ImageInput from "@/components/form/imageInput";
import ImagesInput from "@/components/form/imagesInput";
import InfoField from "@/components/form/infoField";
import CollectionInput from "@/components/form/collectionInput";

const components = {
  text: TextInput,
  choice: ChoiceInput,
  image: ImageInput,
  images: ImagesInput,
  info: InfoField,
  collection: CollectionInput,
};

type Props = {
  fields: Fields;
};

export default function GenericFormItems({ fields }: Props) {
  return (
    <>
      {Object.entries(fields).map(([name, field]) => {
        const { type, visible } = field;
        // TODO fix this
        // if (visible && !visible(formik.values)) {
        //   return null;
        // }
        // TODO do not ignore typescript?
        const Input = components[type];
        // @ts-ignore
        return <Input {...field} key={name} name={name} />;
      })}
    </>
  );
}
