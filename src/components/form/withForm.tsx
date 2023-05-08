import { Formik, FormikProps } from "formik";
import { usePathname } from "next/navigation";
import GenericOptions from "./genericOptions";
import { useState } from "react";
import Link from "next/link";
import { Route } from "next";
import {
  HiCloudUpload,
  HiExclamationCircle,
  HiExternalLink,
  HiOutlineEmojiHappy,
  HiRefresh,
} from "react-icons/hi";
import { ImSpinner2 } from "react-icons/im";
import { BiGitPullRequest } from "react-icons/bi";

type Config = {
  validation: any;
  initialValues?: any;
};

export type FormProps = {
  formik: FormikProps<any>;
};

// TODO implement https://github.com/hCaptcha/react-hcaptcha

// Mark the function as a generic using P (or whatever variable you want)
export default function withForm<P>(
  // Then we need to type the incoming component.
  // This creates a union type of whatever the component
  // already accepts AND our extraInfo prop
  WrappedComponent: React.ComponentType<P & FormProps>,
  { validation, initialValues = {} }: Config
) {
  const ComponentWithForm = (props: P & { className?: string }) => {
    // At this point, the props being passed in are the original props the component expects.
    const path = usePathname();
    const [prUrl, setPrUrl] = useState<string | null>(null);

    return (
      <Formik
        validateOnMount
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={async (data: any) => {
          if (confirm("Are you sure you want to submit the form?")) {
            try {
              const res = await fetch(`${path}/submit`, {
                method: "POST",
                body: JSON.stringify(data),
              });
              const json = await res.json();
              if (!res.ok) {
                throw new Error(json.error);
              }
              setPrUrl(json.prUrl);
            } catch (error) {
              let message = "Unknown Error";
              if (error instanceof Error) message = `Error: ${error.message}`;
              // TODO show in UI
              alert(message);
            }
          }
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            className={`text-center ${props.className}`}
          >
            {prUrl && (
              <>
                <div className="flex justify-center">
                  <HiOutlineEmojiHappy className="text-6xl" />
                </div>
                <div>
                  <h3 className="title">
                    Congrats, your Pull Request was created!
                  </h3>
                  <Link
                    href={prUrl as Route}
                    target="_blank"
                    className="link-hover"
                  >
                    {prUrl}
                  </Link>
                </div>
                <div>
                  <Link
                    href={prUrl as Route}
                    target="_blank"
                    className="btn btn-success btn-lg gap-2"
                  >
                    View PR on Github
                    <HiExternalLink />
                  </Link>
                </div>
              </>
            )}
            {!prUrl && (
              <>
                <WrappedComponent {...props} formik={formik} />
                {/* TODO add generic commit options */}
                {/* <GenericOptions /> */}
                <div className="form-control">
                  <button
                    type="submit"
                    className={`btn btn-lg btn-success gap-2 ${
                      !formik.isValid || formik.isSubmitting
                        ? "btn-disabled"
                        : ""
                    }`}
                  >
                    {!formik.isValid && (
                      <>
                        <HiExclamationCircle />
                        Valid Tweet Required
                      </>
                    )}
                    {formik.isSubmitting && (
                      <>
                        <ImSpinner2 className="animate-spin" />
                        Creating Pull Request...
                      </>
                    )}
                    {formik.isValid && !formik.isSubmitting && (
                      <>
                        <BiGitPullRequest />
                        Create Pull Request
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            {/* <div
              className="btn btn-error gap-2"
              onClick={() => {
                if (
                  prUrl ||
                  confirm("Are you sure you want to reset the form?")
                ) {
                  window.location.reload();
                }
              }}
            >
              <HiRefresh />
              Reset Form
            </div> */}
            {/* <pre className="text-left">{JSON.stringify(formik, null, 2)}</pre> */}
          </form>
        )}
      </Formik>
    );
  };
  return ComponentWithForm;
}
