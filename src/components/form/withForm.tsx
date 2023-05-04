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
    const [prUrl, setPrUrl] = useState<string | null>(
      "https://github.com/Contribunator/Sample/pull/21"
    );

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validation}
        onSubmit={async (data: any) => {
          // TODO handle errors
          const res = await fetch(`${path}/submit`, {
            method: "POST",
            body: JSON.stringify(data),
          });
          const { pullRequestURL } = await res.json();
          setPrUrl(pullRequestURL);
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
                  Congrats, your Pull Request was created.
                  <br />
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
                    className="btn btn-success btn-lg"
                  >
                    View PR on Github
                    <HiExternalLink className="ml-2" />
                  </Link>
                </div>
              </>
            )}
            {!prUrl && (
              <>
                {/* TODO rename data and only pass relevent props */}
                <WrappedComponent {...props} formik={formik} />
                {/* TODO add generic commit options */}
                {/* <GenericOptions /> */}
                <div className="form-control">
                  <button
                    type="submit"
                    className={`btn btn-lg btn-success ${
                      formik.isSubmitting ||
                      !Object.values(formik.touched).length
                        ? "btn-disabled"
                        : ""
                    } ${!formik.isValid ? "btn-warning" : ""}`}
                  >
                    {!formik.isValid && (
                      <>
                        <HiExclamationCircle className="mr-2" />
                        Fix Errors Before Submitting
                      </>
                    )}
                    {formik.isSubmitting && (
                      <>
                        <ImSpinner2 className="mr-2 animate-spin" />
                        Creating Pull Request...
                      </>
                    )}
                    {formik.isValid && !formik.isSubmitting && (
                      <>
                        <HiCloudUpload className="mr-2" />
                        Create Pull Request
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            <div
              className="btn btn-error"
              onClick={() => {
                if (
                  prUrl ||
                  confirm("Are you sure you want to reset the form?")
                ) {
                  setPrUrl(null);
                  formik.resetForm();
                }
              }}
            >
              <HiRefresh className="mr-2" />
              Reset Form
            </div>
            {/* <pre>
              {JSON.stringify(formik, null, 2)}
            </pre> */}
          </form>
        )}
      </Formik>
    );
  };
  return ComponentWithForm;
}
