import Captcha from "./captcha";
import TextInput from "./textInput";
import { FormProps } from "./withForm";
import { useField } from "formik";

export default function GenericOptions({
  formik,
  className = "",
  generateMeta,
}: FormProps & {
  className?: string;
  generateMeta: (data: any) => { name: string; message: string };
}) {
  const [authorization] = useField("authorization");
  const showCaptcha = authorization.value === "captcha";
  const { name, message } = generateMeta(formik.values);

  return (
    <>
      <div className="collapse collapse-arrow rounded-md border border-base-300">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-left text-sm flex items-center peer-checked:font-bold">
          Advanced Options
        </div>
        <div className="collapse-content -mx-4">
          <div className={className}>
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
      </div>
      {showCaptcha && <Captcha />}
    </>
  );
}
