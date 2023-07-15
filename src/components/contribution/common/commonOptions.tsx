import { destructureMeta } from "@/lib/helpers/destructureMeta";
import { decorateFormData } from "@/lib/helpers/decorateFormData";

import type { BaseFormProps } from "@/types";

import TextInput from "../fields/textInput";

export default function CommonOptions({ formik, config }: BaseFormProps) {
  // to do pass fetched files here?
  let metadata = { title: "", message: "" };
  if (formik.isValid) {
    const destructured = destructureMeta(formik.values);
    // todo could be expensive, should we debounce or something?
    // TODO we definitely don't want to bother running this the advanced options is hidden
    if (Object.keys(destructured.data).length > 0) {
      metadata = config.contribution.prMetadata({
        ...destructured,
        ...decorateFormData({ ...destructured, config }),
        config,
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
