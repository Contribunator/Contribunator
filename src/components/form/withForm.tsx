import { Formik, FormikProps } from "formik";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SubmitButton from "./submitButton";
import Captcha from "./captcha";
import Submitted from "./submitted";

type PassedProps = {
  className?: string;
  user?: any;
};
type Config = {
  validation: any;
  initialValues?: any;
};

export type FormProps = {
  formik: FormikProps<any>;
};

// Mark the function as a generic using P (or whatever variable you want)
export default function withForm<P>(
  // Then we need to type the incoming component.
  // This creates a union type of whatever the component
  // already accepts AND our extraInfo prop
  WrappedComponent: React.ComponentType<P & FormProps>,
  { validation, initialValues = {} }: Config
) {
  const ComponentWithForm = (props: P & PassedProps) => {
    const { className = "" } = props;
    // At this point, the props being passed in are the original props the component expects.
    const path = usePathname();
    const [prUrl, setPrUrl] = useState<string | null>(null);
    return (
      <Formik
        validateOnMount
        validationSchema={validation}
        initialValues={{
          ...initialValues,
          ...(props.user && { captcha: "session" }),
        }}
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
            className={`text-center ${className}`}
          >
            {prUrl && <Submitted prUrl={prUrl} />}
            {!prUrl && (
              <>
                <WrappedComponent {...props} formik={formik} />
                {/* TODO add generic commit options */}
                {/* <GenericOptions /> */}
                {!props.user && <Captcha />}
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
