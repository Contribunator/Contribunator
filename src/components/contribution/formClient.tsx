"use client";

import { Formik } from "formik";
import { useEffect, useState } from "react";

import type {
  Authorized,
  ConfigWithContribution,
  FetchedFiles,
  AuthType,
  SubmitState,
  FormikContext,
} from "@/types";

import getConfig from "@/lib/config";

import SubmitButton from "./common/submitButton";
import Submitted from "./common/submitted";
import CommonOptions from "./common/commonOptions";
import AuthWidgets from "./common/authWidgets";
import FormFields from "./fields";
import ConfirmationModal from "./common/confirmationModal";
import Loading from "../common/spinner";
import { HiExclamationCircle } from "react-icons/hi";

declare global {
  interface Window {
    confirmation_modal: {
      showModal: () => void;
    };
  }
}

function Form({
  config,
  user,
}: {
  config: ConfigWithContribution;
  user?: Authorized;
}) {
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
  let authorization: AuthType = "anon";
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
        onSubmit={async (body) => {
          setState({ body, confirming: true });
          window.confirmation_modal.showModal();
        }}
      >
        {(formik: FormikContext) => (
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

type Props = {
  user?: Authorized;
  files?: FetchedFiles;
  repo: string;
  contribution: string;
};

export default async function FormClient({
  repo,
  contribution,
  user,
  files,
}: Props) {
  // now we're client side, get the full config
  const config = await getConfig(repo, contribution);
  // encapsulate form state in it's own component
  return <Form {...{ config, user }} />;
}
