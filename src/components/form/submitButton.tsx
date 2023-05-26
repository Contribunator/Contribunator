import { BiGitPullRequest } from "react-icons/bi";
import { HiExclamationCircle } from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { FormProps } from "./withForm";
import React, { useEffect, useState } from "react";

function Button({
  children,
  className,
  disabled,
}: {
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
}) {
  return (
    <div className="form-control">
      <button
        type="submit"
        className={`btn btn-lg gap-2 ${className}`}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
}

export default function SubmitButton({ formik }: FormProps) {
  // prevent the button from being enabled until the form is valdiated (SSR)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (formik.isSubmitting) {
    return (
      <Button className="btn-disabled">
        <ImSpinner2 className="animate-spin" />
        Creating Pull Request...
      </Button>
    );
  }

  if (mounted && formik.isValid) {
    return (
      <Button className="btn-success">
        <BiGitPullRequest />
        Create Pull Request
      </Button>
    );
  }

  return (
    <Button className="btn-disabled" disabled>
      <HiExclamationCircle />
      Incomplete Required Fields
    </Button>
  );
}
