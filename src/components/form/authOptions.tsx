import Captcha from "./captcha";
import { BaseFormProps } from "./withFormik";

export default function AuthOptions({ formik }: BaseFormProps) {
  if (formik.values.authorization === "captcha") {
    return <Captcha />;
  }
  return null;
}
