"use client";

import { Formik, FormikProps } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { ConfigWithContribution, getContribution } from "@/lib/config";
import commonSchema from "@/lib/commonSchema";

import SubmitButton from "./submitButton";
import Submitted from "./submitted";
import CommonOptions from "./commonOptions";

type PassedProps = {
  user?: any;
  files?: any;
  repo: string;
  contribution: string;
};

export type BaseFormProps = {
  formik: FormikProps<any>;
  config: ConfigWithContribution;
};

export type FormProps = BaseFormProps & {
  files?: any; // TODO
  user?: any;
};

// TODO do not pass intiial values here, instead get from type's config
export default function withFormik(Form: React.ComponentType<FormProps>) {
  return function WithFormik({ repo, contribution, user, files }: PassedProps) {
    const [prUrl, setPrUrl] = useState<string | null>(null);

    const config = getContribution(repo, contribution);
    const { initialValues, schema, type } = config.contribution;

    const submitUrl = `/api/contribute/${type}`;
    const validationSchema = Yup.object({ ...schema, ...commonSchema });

    // determine the auth UI based on use login status and config
    let authorization = "anon";
    if (user) {
      authorization = "github";
    } else if (config.authorization.includes("captcha")) {
      authorization = "captcha";
    }

    return (
      <Formik
        validateOnMount
        validationSchema={validationSchema}
        initialValues={{
          // TODO move to the schema generation function
          ...initialValues,
          authorization,
          repo,
          contribution,
          customMessage: "",
          customTitle: "",
        }}
        onSubmit={async (data: any) => {
          if (confirm("Are you sure you want to submit the form?")) {
            try {
              const res = await fetch(submitUrl, {
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
            className={`text-center space-y-6 bg-base-200 p-4 rounded-lg`}
          >
            {prUrl && <Submitted prUrl={prUrl} />}
            {!prUrl && (
              <>
                <Form {...{ formik, config, files, user }} />
                <CommonOptions {...{ formik, config }} />
                <SubmitButton {...{ formik, config }} />
              </>
            )}
            {/* <pre className="text-left">{JSON.stringify(formik, null, 2)}</pre> */}
          </form>
        )}
      </Formik>
    );
  };
}
