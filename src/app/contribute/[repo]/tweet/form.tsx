"use client";

import { getRepoConfig } from "@/config";
import { usePathname } from "next/navigation";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  useField,
} from "formik";
import validationSchema from "./validationSchema";
import { HiArrowDown, HiChevronDown } from "react-icons/hi";
import { useRef } from "react";

type Props = {
  repo: string;
  options: any;
};

/*
types:

- simple
- retweet
- reply
- media

- vnext poll
- vnext thread
*/

function TextInput({
  title,
  id,
  as = "input",
  type = "text",
  info,
  placeholder,
}: {
  title: string;
  id: string;
  type?: string;
  as?: null | "input" | "textarea";
  info?: string;
  placeholder?: string;
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
    <div className="form-control">
      <label className="label" htmlFor={id}>
        <span className="label-text">{title}</span>
        {!!hasError && (
          <span className="label-text-alt text-error">{meta.error}</span>
        )}
      </label>
      <Field
        name={id}
        type={type}
        as={as}
        className={`w-full ${styles}`}
        placeholder={placeholder}
      />
      {info && (
        <label className="label">
          <span className="label-text-alt">{info}</span>
        </label>
      )}
      {/* <pre>{JSON.stringify({ field, meta }, null, 2)}</pre> */}
    </div>
  );
}

function ChoiceInput({
  name,
  options,
}: {
  name: string;
  options: { [key: string]: { text: string } };
}) {
  const [field, meta, helpers] = useField(name);
  return (
    <div className="form-control">
      <div className="flex items-center">
        <div className="dropdown">
          <label tabIndex={0} className="btn m-1">
            {options[field.value].text}
            <HiChevronDown className="ml-2" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {Object.keys(options)
              .filter((name) => name !== field.value)
              .map((name) => (
                <li key={name}>
                  <a
                    onClick={() => {
                      (document.activeElement as HTMLElement)?.blur();
                      helpers.setValue(name);
                    }}
                  >
                    {options[name].text}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        {!field.value && (
          <label className="label label-text">Change to reply or retweet</label>
        )}
      </div>
      {/* <pre>{JSON.stringify(field, null, 2)}</pre> */}
    </div>
  );
}

function EmbedTweet({ url }: { url: string | false }) {
  console.log(url);
  const iframeRef = useRef(null);
  // TODO scroll to bottom
  return (
    <div className="-mx-6 h-64 bg-slate-300 rounded-lg flex items-center justify-center">
      {!url ? (
        <div className="text-sm text-slate-500">
          Valid quoted tweet preview will appear here
        </div>
      ) : (
        <iframe
          className="w-full h-full"
          ref={iframeRef}
          src={`https://twitframe.com/show?url=${encodeURIComponent(
            url as string
          )}`}
        />
      )}
    </div>
  );
}

const quoteTypes: { [key: string]: { text: string } } = {
  "": { text: "No Quote" },
  retweet: { text: "Retweet" },
  reply: { text: "Reply" },
};

export default function TweetForm({ repo, options }: Props) {
  // const config = getRepoConfig(repo);
  // const path = usePathname();
  return (
    <Formik
      initialValues={{
        text: "",
        quoteType: "",
        quoteUrl: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        console.log("submitted");
        console.log(data);
      }}
    >
      {(data) => {
        console.log(data);
        const { quoteType } = data.values;
        const quoteText = quoteTypes[quoteType].text;
        const quoteUrl = data.getFieldMeta("quoteUrl");
        const validQuote =
          quoteUrl.touched && !quoteUrl.error && (quoteUrl.value as string);
        return (
          <Form className="max-w-lg mx-auto space-y-2 bg-slate-200 p-10">
            <TextInput
              title="Tweet Text"
              id="text"
              as="textarea"
              placeholder="e.g. I like turtles 🐢 #turtlepower"
              info="Can be left blank if retweeting"
            />
            <ChoiceInput name="quoteType" options={quoteTypes} />
            {!!data.values.quoteType && (
              <>
                <TextInput
                  title={`${quoteText} URL`}
                  id="quoteUrl"
                  placeholder="e.g. https://twitter.com/[user]/status/[id]"
                  info="Enter the URL of the tweet you want to quote"
                />
                <EmbedTweet url={validQuote} />
              </>
            )}
            {/* TODO Get using twitter API? */}
            <button type="submit" className="btn">
              Submit
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
