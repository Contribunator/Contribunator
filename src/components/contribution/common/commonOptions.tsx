import TextInput from "../fields/textInput";
import type { BaseFormProps } from "../formClient";

export default function GenericOptions({ formik, config }: BaseFormProps) {
  const meta = formik.isValid
    ? config.contribution.prMetadata(formik.values)
    : {
        title: "",
        message: "",
      };
  return (
    <>
      <div className="collapse collapse-arrow rounded-md bg-base-100 bg-opacity-50">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-left text-sm flex items-center peer-checked:font-bold">
          Advanced Options
        </div>
        <div className="collapse-content space-y-6 -mx-1">
          <TextInput
            title="Custom Pull Request Title"
            info="Special characters will be removed"
            name="customTitle"
            placeholder={meta.title}
          />
          <TextInput
            title="Custom Pull Request Message"
            name="customMessage"
            placeholder={meta.message}
            as="textarea"
          />
        </div>
      </div>
    </>
  );
}
