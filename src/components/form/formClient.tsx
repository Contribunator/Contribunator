"use client";

import withFormik, { FormProps } from "@/components/form/withFormik";

import FormFields from "./fields";

// TODO pass other props e.g. files.

function FormClient({ config }: FormProps) {
  return <FormFields fields={config.contribution.form.fields} />;
}

export default withFormik(FormClient);
