"use client";

import withFormik from "@/components/form/withFormik";

const schema = {};
const transform = () => {
  return { name: "test", message: "test" };
};

// this function is used to generate the form
function GenericFormContent({ formik, config, files }) {
  return (
    <div>
      Form Goes Here
      <pre>{JSON.stringify(files, null, 2)}</pre>
    </div>
  );
}

export default withFormik(GenericFormContent, {
  schema,
  transform,
  initialValues: {
    quoteType: undefined,
    quoteUrl: "",
    text: "",
    media: ["", "", "", ""],
    alt_text_media: ["", "", "", ""],
  },
});
