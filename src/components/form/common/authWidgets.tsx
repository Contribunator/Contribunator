import Captcha from "./captcha";
import type { BaseFormProps } from "../withFormik";

export default function AuthWidgets({ formik }: BaseFormProps) {
  if (formik.values.authorization === "captcha") {
    return <Captcha />;
  }
  return null;
}
