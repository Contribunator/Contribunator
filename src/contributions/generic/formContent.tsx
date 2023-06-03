"use client";

import withFormik, { FormProps } from "@/components/form/withFormik";

// this function is used to generate the form
function GenericFormContent({
  formik,
  files,
  config: { contribution },
}: FormProps) {
  return (
    <div>
      Form Goes Here
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </div>
  );
}

export default withFormik(GenericFormContent);
