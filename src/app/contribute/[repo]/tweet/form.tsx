"use client";

import {
  TextInput,
  ChoiceInput,
  EmbedTweet,
  withForm,
  FormProps,
  ImagesInput,
} from "@/components/form";

import validation from "./validation";

type Props = {};

/*
TODO: polls & thread
*/

const quoteTypes: { [key: string]: { text: string } } = {
  retweet: { text: "Retweet" },
  reply: { text: "Reply" },
};

function TweetForm({ formik }: Props & FormProps) {
  // const config = getRepoConfig(repo);
  const { quoteType } = formik.values;
  const quoteUrl = formik.getFieldMeta("quoteUrl");
  const validQuote =
    quoteUrl.touched && !quoteUrl.error && (quoteUrl.value as string);
  return (
    <>
      <TextInput
        title="Tweet Text"
        id="text"
        as="textarea"
        placeholder="e.g. I like turtles 🐢 #turtlepower"
        info="Can be left blank if retweeting"
      />
      <ChoiceInput name="quoteType" options={quoteTypes} unset="No Quote" />
      {!!formik.values.quoteType && (
        <>
          <TextInput
            title={`${quoteTypes[quoteType].text} URL`}
            id="quoteUrl"
            placeholder="e.g. https://twitter.com/[user]/status/[id]"
            info="Enter the URL of the tweet you want to quote"
          />
          <EmbedTweet url={validQuote} />
        </>
      )}
      <ImagesInput name="media" limit={4} />
      {/* tweet preview */}
      {/* <pre className="bg-red-300 p-4">{transformTweet(data.values)}</pre> */}
    </>
  );
}

export default withForm(TweetForm, { validation });
