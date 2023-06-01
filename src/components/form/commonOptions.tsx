import { useField } from "formik";

import Captcha from "./captcha";
import TextInput from "./textInput";
import { FormProps } from "./withFormik";

export default function GenericOptions({
  formik,
  transform,
}: FormProps & {
  transform: (data: any) => { name: string; message: string };
}) {
  const [authorization] = useField("authorization");
  const showCaptcha = authorization.value === "captcha";
  const { name, message } = transform(formik.values);

  return (
    <>
      <div className="collapse collapse-arrow rounded-md border border-base-300">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-left text-sm flex items-center peer-checked:font-bold">
          Advanced Options
        </div>
        <div className="collapse-content space-y-6">
          <TextInput
            title="Custom Pull Request Name"
            info="Special characters will be removed"
            name="customName"
            placeholder={name}
          />
          <TextInput
            title="Custom Pull Request Message"
            name="customMessage"
            placeholder={message}
            as="textarea"
          />
        </div>
      </div>
      {showCaptcha && <Captcha />}
    </>
  );
}
