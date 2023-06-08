export type Suggestion = {
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

export default function tweetSuggestions(
  keys: SuggestionTypes[] = []
): Suggestion[] {
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
