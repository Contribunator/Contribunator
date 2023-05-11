"use client";

import {
  TextInput,
  ChoiceInput,
  EmbedTweet,
  FormProps,
  ImagesInput,
  withForm,
} from "@/components/form";
import tweetValidation from "./validateTweet";

/*
TODO: polls & thread
*/

const quoteTypes: { [key: string]: { text: string } } = {
  retweet: { text: "Retweet" },
  reply: { text: "Reply" },
};

function TweetForm({ formik }: FormProps) {
  // const config = getRepoConfig(repo);
  const { quoteType } = formik.values;
  const quoteUrl = formik.getFieldMeta("quoteUrl");
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
        placeholder="e.g. I like turtles 🐢 #turtlepower"
        info="Optional when retweeting or uploading images"
      />
      <ImagesInput name="media" limit={4} />
      {/* tweet preview */}
      {/* <pre className="bg-red-300 p-4">{transformTweet(data.values)}</pre> */}
      {/* {<pre>{JSON.stringify(formik.errors, null, 2)}</pre>} */}
    </>
  );
}

// export default TweetForm;

export default withForm(TweetForm, {
  validation: tweetValidation,
  initialValues: {
    quoteType: undefined,
    quoteUrl: "",
    text: "",
    media: ["", "", "", ""],
    alt_text_media: ["", "", "", ""],
  },
});
