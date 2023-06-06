"use client";

import ChoiceInput from "@/components/form/choiceInput";
import EmbedTweet from "@/components/form/embedTweet";
import TextInput from "@/components/form/textInput";
import ImagesInput from "@/components/form/imagesInput";

import withFormik, { FormProps } from "@/components/form/withFormik";

/*
TODO: polls & thread
*/

const quoteTypes: { [key: string]: { title: string } } = {
  retweet: { title: "Retweet" },
  reply: { title: "Reply" },
};

function TweetFormContent({ formik, config: { contribution } }: FormProps) {
  const { quoteType } = formik.values;
  const quoteUrl = formik.getFieldMeta("quoteUrl");
  const { text = {} } = contribution?.options || {};
  return (
    <>
      <ChoiceInput
        title="Quote Type"
        as="buttons"
        name="quoteType"
        options={quoteTypes}
        unset="None"
      />
      {!!formik.values.quoteType && (
        <div>
          <TextInput
            transform={(value) => value.split("?")[0].trim()}
            title={`${quoteTypes[quoteType].title} URL`}
            name="quoteUrl"
            placeholder="e.g. https://twitter.com/[user]/status/[id]"
          />
          <EmbedTweet
            url={
              quoteUrl.touched && !quoteUrl.error && (quoteUrl.value as string)
            }
          />
        </div>
      )}
      <TextInput
        title="Tweet Text"
        name="text"
        as="textarea"
        info="Optional when retweeting or uploading images"
        placeholder={text.placeholder || "e.g. This is my tweet!"}
        suggestions={text.suggestions}
        tags={text.tags}
      />
      <ImagesInput name="media" limit={4} />
    </>
  );
}

export default withFormik(TweetFormContent);
