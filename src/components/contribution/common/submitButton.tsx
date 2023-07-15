import { BiGitPullRequest } from "react-icons/bi";
import { HiExclamationCircle, HiInformationCircle } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";

import type { BaseFormProps, SubmitState } from "@/types";

function BigButton({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
}) {
  return (
    <div className="form-control">
      <button type="submit" className={`btn btn-lg ${className}`} {...props}>
        {children}
      </button>
    </div>
  );
}

export default function SubmitButton({
  formik,
  state,
}: BaseFormProps & { state: SubmitState }) {
  if (state.confirming) {
    return (
      <BigButton className="btn-disabled" disabled>
        <HiInformationCircle />
        Please confirm
      </BigButton>
    );
  }
  if (formik.isSubmitting || state.submitting) {
    return (
      <BigButton className="btn-disabled" disabled>
        <ImSpinner2 className="animate-spin" />
        Creating Pull Request...
      </BigButton>
    );
  }

  if (formik.isValid) {
    return (
      <BigButton className="btn-success">
        <BiGitPullRequest />
        Create Pull Request
      </BigButton>
    );
  }

  return (
    <BigButton className="btn-disabled" disabled>
      <HiExclamationCircle />
      Incomplete Required Fields
    </BigButton>
  );
}
