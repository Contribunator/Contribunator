"use client";

import { Formik, FormikProps } from "formik";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

import { ConfigWithContribution, getConfig } from "@/lib/config";
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

type Config = {
  schema: any;
  transform: (data: any) => { name: string; message: string };
  initialValues?: any;
};

export type FormProps = {
  formik: FormikProps<any>;
  config: ConfigWithContribution;
};

// TODO do not pass intiial values here, instead get from type's config
export default function withFormik(
  Form: React.ComponentType<FormProps>,
  { schema, transform, initialValues = {} }: Config
) {
  return function WithFormik({ repo, contribution, user, files }: PassedProps) {
    const [prUrl, setPrUrl] = useState<string | null>(null);

    const config = getConfig(repo, contribution);

    // TODO move then to config generation
    const submitUrl = `/api/contribute/${config.repo.contribution.type}`;

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
        validationSchema={Yup.object({ ...schema, ...commonSchema })}
        initialValues={{
          ...initialValues,
          authorization,
          repo,
          contribution,
          customMessage: "",
          customName: "",
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
                <Form {...{ formik, config, files }} />
                {/* TODO only pass the metadata transform, not the commit */}
                <CommonOptions {...{ formik, config, transform }} />
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
