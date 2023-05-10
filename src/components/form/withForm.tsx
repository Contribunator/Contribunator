import { Formik, FormikProps } from "formik";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Route } from "next";
import { HiExternalLink, HiOutlineEmojiHappy } from "react-icons/hi";
import SubmitButton from "./submitButton";

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
              <div className="py-6 space-y-6">
                <div className="flex justify-center">
                  <HiOutlineEmojiHappy className="text-6xl" />
                </div>
                <div>
                  <h3 className="title">
                    Congrats, your Pull Request was created!
                  </h3>
                  <Link
                    className="link-hover text-xs"
                    href={prUrl as Route}
                    target="_blank"
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
              </div>
            )}
            {!prUrl && (
              <>
                <WrappedComponent {...props} formik={formik} />
                {/* TODO add generic commit options */}
                {/* <GenericOptions /> */}
                <SubmitButton formik={formik} />
              </>
            )}
            {/* <pre className="text-left">{JSON.stringify(formik, null, 2)}</pre> */}
          </form>
        )}
      </Formik>
    );
  };
  return ComponentWithForm;
}
