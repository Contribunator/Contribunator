export default function EmbedTweet({ url }: { url?: string | boolean }) {
  // TODO Get using twitter API?
  if (!url) {
    return null;
  }
  return (
    <>
      <iframe
        className="w-full h-64 bg-base-100 rounded-lg my-2"
        src={`https://twitframe.com/show?url=${encodeURIComponent(
          url as string
        )}`}
      />
    </>
  );
}
