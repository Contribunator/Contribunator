"use client";

import { Formik, FormikProps } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { ConfigWithContribution, getContribution } from "@/lib/config";
import { CreatePullRequestOutputs } from "@/lib/createPullRequest";

import commonSchema from "@/lib/commonSchema";

import SubmitButton from "./submitButton";
import Submitted from "./submitted";
import CommonOptions from "./commonOptions";
import AuthOptions from "./authOptions";

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
    const [pr, setPr] = useState<{ pr: CreatePullRequestOutputs } | null>(null);

    const config = getContribution(repo, contribution);
    const { schema, type } = config.contribution;

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
          repo,
          authorization,
          contribution,
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
              if (!json.pr) {
                throw new Error("Unexpected response");
              }
              setPr(json);
            } catch (error) {
              let message = "Unknown Error";
              if (error instanceof Error) message = `Error: ${error.message}`;
              // TODO show in DOM
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
            {pr && <Submitted pr={pr} />}
            {!pr && (
              <>
                <Form {...{ formik, config, files, user }} />
                <AuthOptions {...{ formik, config }} />
                <SubmitButton {...{ formik, config }} />
                <CommonOptions {...{ formik, config }} />
              </>
            )}
          </form>
        )}
      </Formik>
    );
  };
}
