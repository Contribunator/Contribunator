import Captcha from "./captcha";
import { FormProps } from "./withForm";
import { useField } from "formik";

export default function GenericOptions({ formik }: FormProps) {
  const [authorization] = useField("authorization");
  const showCaptcha = authorization.value === "captcha";

  return (
    <>
      {showCaptcha && <Captcha />}
      {/* <div
        tabIndex={0}
        className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
      >
        <div className="collapse-title text-xl font-medium">
          Advanced Options
        </div>
        <div className="collapse-content">
          TODO: - Branch selection - Commit Message - Star Repo
        </div>
      </div> */}
    </>
  );
}
