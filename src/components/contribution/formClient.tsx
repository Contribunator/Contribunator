"use client";

import { Formik, FormikProps } from "formik";
import { useState } from "react";

import type { ConfigWithContribution } from "@/types";

import getConfig from "@/lib/config";

import SubmitButton from "./common/submitButton";
import Submitted from "./common/submitted";
import CommonOptions from "./common/commonOptions";
import AuthWidgets from "./common/authWidgets";
import FormFields from "./fields";

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

export type PrData = {
  pr: {
    title: string;
    number: number;
    url: string;
  };
  test?: any;
};

export default async function FormClient({
  repo,
  contribution,
  user,
  files,
}: PassedProps) {
  const [pr, setPr] = useState<PrData | null>(null);
  const config = await getConfig(repo, contribution);
  // determine the auth UI based on use login status and config
  let authorization = "anon";
  if (user) {
    authorization = "github";
  } else if (config.repo.authorization.includes("captcha")) {
    authorization = "captcha";
  }

  return (
    <Formik
      validateOnMount
      validationSchema={config.contribution.schema}
      initialValues={{ repo, authorization, contribution }}
      onSubmit={async (data: any) => {
        if (confirm("Are you sure you want to submit the form?")) {
          try {
            const res = await fetch(`/api/contribute`, {
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
          className={`text-center space-y-6 bg-base-200 p-4 rounded-lg relative overflow-hidden`}
        >
          {pr && <Submitted pr={pr} />}
          {!pr && (
            <>
              <FormFields fields={config.contribution.form.fields} />
              <AuthWidgets {...{ formik, config }} />
              <SubmitButton {...{ formik, config }} />
              <CommonOptions {...{ formik, config }} />
            </>
          )}
        </form>
      )}
    </Formik>
  );
}
