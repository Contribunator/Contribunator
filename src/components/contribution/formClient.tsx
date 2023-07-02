"use client";

import { Formik, FormikProps } from "formik";
import { useEffect, useState } from "react";

import type { ConfigWithContribution } from "@/types";

import getConfig from "@/lib/config";

import SubmitButton from "./common/submitButton";
import Submitted from "./common/submitted";
import CommonOptions from "./common/commonOptions";
import AuthWidgets from "./common/authWidgets";
import FormFields from "./fields";
import ConfirmationModal from "./common/confirmationModal";
import Loading from "../common/spinner";
import { HiExclamationCircle } from "react-icons/hi";

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

export type SubmitState = {
  pr?: {
    title: string;
    number: number;
    url: string;
  };
  error?: string;
  submitting?: boolean;
  confirming?: boolean;
  data?: any;
  test?: any;
  mounting?: boolean;
};

declare global {
  interface Window {
    confirmation_modal: any;
  }
}

function Form({ config, user }: { config: ConfigWithContribution; user: any }) {
  // todo global mounted state
  const [state, setState] = useState<SubmitState>({ mounting: true });

  // prevent the button from being enabled until the form is valdiated (SSR)
  useEffect(() => {
    setState({ mounting: false });
  }, []);

  // loader if not mounted
  if (state.mounting) {
    return <Loading />;
  }

  // determine the auth UI based on use login status and config
  let authorization = "anon";
  if (user && config.repo.authorization.includes("github")) {
    authorization = "github";
  } else if (config.repo.authorization.includes("captcha")) {
    authorization = "captcha";
  }

  return (
    <>
      <ConfirmationModal {...{ state, setState, config }} />
      <Formik
        validateOnMount
        validationSchema={config.contribution.schema}
        initialValues={{
          authorization,
          repo: config.repo.name,
          contribution: config.contribution.name,
        }}
        onSubmit={async (data: any) => {
          setState({ data, confirming: true });
          window.confirmation_modal.showModal();
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            className={`text-center space-y-8 bg-base-200 p-4 rounded-lg relative`}
          >
            {state.pr && <Submitted pr={state.pr} test={state.test} />}
            {!state.pr && (
              <>
                <FormFields fields={config.contribution.form.fields} />
                <AuthWidgets {...{ formik, config }} />
                <SubmitButton {...{ formik, config, state }} />
                {state.error && (
                  <div className="alert alert-error">
                    <HiExclamationCircle />
                    <span>
                      <b>Error:</b> {state.error}
                    </span>
                  </div>
                )}
                <CommonOptions {...{ formik, config }} />
              </>
            )}
          </form>
        )}
      </Formik>
    </>
  );
}

export default async function FormClient({
  repo,
  contribution,
  user,
  files,
}: PassedProps) {
  // now we're client side, get the full config
  const config = await getConfig(repo, contribution);
  // encapsulate form state in it's own component
  return <Form {...{ config, user }} />;
}
