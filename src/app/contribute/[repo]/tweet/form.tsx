"use client";

import transformTweet from "./transform";
import validation from "./validation";

import {
  TextInput,
  ChoiceInput,
  EmbedTweet,
  withForm,
  FormProps,
  ImageInput,
  ImagesInput,
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
  retweet: { text: "Retweet" },
  reply: { text: "Reply" },
};

function TweetForm({ repo, options, data }: Props & FormProps) {
  // const config = getRepoConfig(repo);
  const { quoteType } = data.values;
  const quoteUrl = data.getFieldMeta("quoteUrl");
  const validQuote =
    quoteUrl.touched && !quoteUrl.error && (quoteUrl.value as string);
  const { tweet: preview } = transformTweet(data.values);
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
      <ChoiceInput name="quoteType" options={quoteTypes} unset="No Quote" />
      {!!data.values.quoteType && (
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
      {/* TODO allow up to 4 images */}
      <ImagesInput name="media" limit={4} />
      {/* <ImageInput name="media[0]" /> */}
      {/* tweet preview */}

      <pre className="bg-red-300 p-4">{preview}</pre>
    </>
  );
}

export default withForm(TweetForm, { validation });
