"use client";

import ChoiceInput from "@/components/form/choiceInput";
import EmbedTweet from "@/components/form/embedTweet";
import TextInput from "@/components/form/textInput";
import withFormik from "@/components/form/withFormik";

import { ImagesInput } from "@/components/form/imageInput";
import { FormProps } from "@/components/form/withFormik";

import schema from "./schema";
import transform from "./transform";

/*
TODO: polls & thread
*/

const quoteTypes: { [key: string]: { text: string } } = {
  retweet: { text: "Retweet" },
  reply: { text: "Reply" },
};

function TweetFormContent({
  formik,
  config: {
    repo: { contribution },
  },
}: // TODO fix the typings
FormProps & any) {
  const { quoteType } = formik.values;
  const quoteUrl = formik.getFieldMeta("quoteUrl");
  const { text = {} } = contribution?.options || {};
  return (
    <>
      <ChoiceInput
        title="Quote Type"
        type="buttons"
        name="quoteType"
        options={quoteTypes}
        unset="None"
      />
      {!!formik.values.quoteType && (
        <div>
          <TextInput
            transform={(value) => value.split("?")[0].trim()}
            title={`${quoteTypes[quoteType].text} URL`}
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
      <ImagesInput
        name="media"
        limit={4}
        totalFileSizeLimit={4.3} // vercel server functions to 5MB
      />
    </>
  );
}

export default withFormik(TweetFormContent, {
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
