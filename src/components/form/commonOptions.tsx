import { useField } from "formik";

import Captcha from "./captcha";
import TextInput from "./textInput";
import { BaseFormProps } from "./withFormik";

export default function GenericOptions({ formik, config }: BaseFormProps) {
  const [authorization] = useField("authorization");
  const showCaptcha = authorization.value === "captcha";
  const { title, message } = config.contribution.metadata;
  return (
    <>
      <div className="collapse collapse-arrow rounded-md border border-base-300">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-left text-sm flex items-center peer-checked:font-bold">
          Advanced Options
        </div>
        <div className="collapse-content space-y-6">
          <TextInput
            title="Custom Pull Request Title"
            info="Special characters will be removed"
            name="customTitle"
            placeholder={title(formik.values)}
          />
          <TextInput
            title="Custom Pull Request Message"
            name="customMessage"
            placeholder={message(formik.values)}
            as="textarea"
          />
        </div>
      </div>
      {showCaptcha && <Captcha />}
    </>
  );
}
