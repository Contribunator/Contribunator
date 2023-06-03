import { FaTwitter } from "react-icons/fa";

import { Contribution, TailwindColor } from "@/lib/config";

import schema from "./schema";
import * as metadata from "./metadata";

type Suggestion = {
  has?: string;
  hasNo?: string;
  message: string;
};

const suggestions: { [key: string]: Suggestion } = {
  spacing: {
    has: "(?<!\n)\n(?!\n)",
    message: "Use double spaces to separate lines",
  },
  hashtags: {
    hasNo: "[#$]",
    message: "Include some Hashtags",
  },
  emojis: {
    hasNo: "\\p{Emoji_Presentation}",
    message: "Add emojis to your tweet",
  },
  noFirstAt: {
    has: "^@",
    message:
      "Don't start your tweet with `@` (prefix with . to reply properly)",
  },
};

type SuggestionTypes = keyof typeof suggestions;

export function tweetSuggestions(keys: SuggestionTypes[] = []): Suggestion[] {
  if (keys.length === 0) {
    return Object.values(suggestions);
  }
  return keys.map((key) => {
    if (!suggestions[key]) {
      throw new Error(`Invalid suggestion key: ${key}`);
    }
    return suggestions[key];
  });
}

const defaultConfig = {
  type: "tweet",
  name: "tweet",
  title: "Tweet",
  color: "blue" as TailwindColor,
  icon: FaTwitter,
  description: "Submit a tweet",
  options: {
    text: {
      placeholder: "Enter tweet text here",
      suggestions: tweetSuggestions(),
      tags: ["👀", "😂", "✨", "🔥", "💪", "#twitter", "#memes", "#love"],
    },
    // TODO
    // media: true,
    // qutoe: true,
    // threads: true
    // polls: true
  },
};

type TextFieldOptions = {
  placeholder?: string;
  tags?: string[];
  suggestions?: Suggestion[];
};

type TweetConfig = Contribution & {
  options: { text: TextFieldOptions };
};

type TweetOptions = Omit<Partial<TweetConfig>, "type"> & { name?: string };

export default function tweetConfig(opts: TweetOptions = {}): TweetConfig {
  // TODO generate different schema, initialValues, meta based on config options
  const initialValues = {
    quoteType: undefined,
    quoteUrl: "",
    text: "",
    media: ["", "", "", ""],
    alt_text_media: ["", "", "", ""],
  };

  return {
    ...defaultConfig,
    ...opts,
    initialValues,
    schema,
    metadata,
    options: {
      text: {
        ...defaultConfig.options.text,
        ...opts.options?.text,
      },
    },
  };
}
