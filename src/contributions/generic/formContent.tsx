"use client";

import withFormik, { FormProps } from "@/components/form/withFormik";
import { GenericConfig } from "./config";

import GenericFormItems from "./formItems";

// TODO pass other props e.g. files.

function GenericFormContent({ config }: FormProps) {
  const { fields } = (config.contribution as GenericConfig).options;
  return <GenericFormItems fields={fields} />;
}

export default withFormik(GenericFormContent);
