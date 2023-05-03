"use client";

import validation from "./validation";

import {
  TextInput,
  ChoiceInput,
  EmbedTweet,
  withForm,
  FormProps,
  ImageInput,
} from "@/components/form";

type Props = {
  repo: string;
  options: any;
};

/*
types:

- simple
- retweet
- reply
- media (available unless poll)
- poll (available with reply)

- vnext poll
- vnext thread
*/

const quoteTypes: { [key: string]: { text: string } } = {
  "": { text: "No Quote" },
  retweet: { text: "Retweet" },
  reply: { text: "Reply" },
};

const initialValues = {
  text: "",
  quoteType: "",
  quoteUrl: "",
};

function TweetForm({ repo, options, data }: Props & FormProps) {
  // const config = getRepoConfig(repo);
  const { quoteType } = data.values;
  const quoteText = quoteTypes[quoteType].text;
  const quoteUrl = data.getFieldMeta("quoteUrl");
  const validQuote =
    quoteUrl.touched && !quoteUrl.error && (quoteUrl.value as string);
  return (
    <>
      {/* <pre>{JSON.stringify({ repo, options }, null, 2)}</pre> */}
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
      {/* TODO allow up to 4 images */}
      <ImageInput name="media[0]" />
    </>
  );
}

export default withForm(TweetForm, { validation, initialValues });
