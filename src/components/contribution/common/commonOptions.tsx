import { destructureMeta } from "@/lib/helpers/destructureMeta";
import TextInput from "../fields/textInput";
import type { BaseFormProps } from "../formClient";
import { decorateFormData } from "@/lib/helpers/decorateFormData";

export default function CommonOptions({ formik, config }: BaseFormProps) {
  // to do pass fetched files here?
  let metadata = { title: "", message: "" };
  // TODO we definitely don't want to bother running this if it's hidden
  if (formik.isValid) {
    const { data, meta } = destructureMeta(formik.values);
    if (Object.keys(data).length > 0) {
      // todo this is quite expensive, should we debounce or something?
      const { formData } = decorateFormData({ data, config });
      metadata = config.contribution.prMetadata({
        data,
        meta,
        config,
        formData,
      });
    }
  }
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
            placeholder={metadata.title}
          />
          <TextInput
            title="Custom Pull Request Message"
            name="customMessage"
            placeholder={metadata.message}
            as="textarea"
          />
        </div>
      </div>
    </>
  );
}
