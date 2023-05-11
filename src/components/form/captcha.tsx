import { captchaKey } from "@/env";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useField } from "formik";

export default function Captcha() {
  const [, meta, helpers] = useField("captcha");

  return (
    <div className="flex items-center justify-center flex-col space-y-4">
      <HCaptcha
        sitekey={captchaKey}
        onVerify={(token) => {
          helpers.setValue(token);
        }}
      />
      {meta.error && <div className="text-error text-sm">{meta.error}</div>}
    </div>
  );
}
