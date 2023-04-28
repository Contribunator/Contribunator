"use client";

import { getRepoConfig } from "@/config";
import { usePathname } from "next/navigation";
import { Field, Form, Formik, useField } from "formik";
import validationSchema from "./validationSchema";

type Props = {
  repo: string;
  options: any;
};

function MyInput({
  title,
  id,
  as = "input",
  type = "text",
}: {
  title: string;
  id: string;
  type?: string;
  as?: null | "input" | "textarea";
}) {
  const [field, meta] = useField(id);
  const hasError = meta.error && meta.touched;
  const styles = [
    hasError && "input-error",
    as === "input" && "input input-bordered",
    as === "textarea" && "textarea textarea-bordered h-32",
  ]
    .filter((a) => a)
    .join(" ");
  return (
    <div>
      <label className="label" htmlFor={id}>
        <span className="label-text">{title}</span>
        {!!hasError && (
          <span className="label-text-alt text-error">{meta.error}</span>
        )}
      </label>
      <Field name={id} type={type} as={as} className={`w-full ${styles}`} />
      <pre>{JSON.stringify({ field, meta }, null, 2)}</pre>
    </div>
  );
}

export default function TweetForm({ repo, options }: Props) {
  // const config = getRepoConfig(repo);
  // const path = usePathname();
  // TODO use https://github.com/twitter/twitter-text
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={console.log}
    >
      <Form className="max-w-sm space-y-2 bg-slate-200 p-10">
        <MyInput title="Another Input" id="firstName" as="textarea" />
        <MyInput title="Tweet Content" id="lastName" />
        <button type="submit" className="btn">
          Submit
        </button>
      </Form>
    </Formik>
  );
}
