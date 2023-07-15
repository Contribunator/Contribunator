import { HiExclamation } from "react-icons/hi";

import type { BaseFormProps } from "@/types";
import Captcha from "./captcha";

export default function AuthWidgets({ formik, config }: BaseFormProps) {
  if (
    formik.values.authorization === "anon" &&
    !config.repo.authorization.includes("anon")
  ) {
    return (
      <div className="absolute inset-0 backdrop-blur-sm bg-base-100 bg-opacity-20 z-10 !m-0">
        <div className="m-10 p-6 font-bold space-y-4 bg-base-100 rounded-xl bg-opacity-80">
          <div className="text-3xl">
            <HiExclamation className="inline" />
          </div>
          <div>
            {!config.repo.authorization.includes("github")
              ? "This contribution is only available via an API"
              : "You must sign in to submit this type of contribution"}
          </div>
        </div>
      </div>
    );
  }
  if (formik.values.authorization === "captcha") {
    return <Captcha />;
  }
  return null;
}
