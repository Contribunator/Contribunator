import TextInput from "@/components/form/textInput";
import ChoiceInput from "@/components/form/choiceInput";
import ImageInput from "@/components/form/imageInput";
import ImagesInput from "@/components/form/imagesInput";
import InfoField from "@/components/form/infoField";
import CollectionInput from "@/components/form/collectionInput";
import { useFormikContext } from "formik";
import { Field as BaseField, Fields } from "./config";

const components = {
  text: TextInput,
  choice: ChoiceInput,
  image: ImageInput,
  images: ImagesInput,
  info: InfoField,
  collection: CollectionInput,
};

type Field = BaseField & { name: string; index: number };
type VisibilityProps = {
  field: Field;
  children: any;
};

// fetch values for visible method
function RenderWhenVisible({ field, children }: VisibilityProps) {
  const formik = useFormikContext();
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

export default function GenericFormItems({ fields }: { fields: Fields }) {
  return (
    <>
      {Object.entries(fields).map(([name, val]) => {
        const field = { name, ...val } as Field;
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
