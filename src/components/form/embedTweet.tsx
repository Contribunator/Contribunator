export default function EmbedTweet({ url }: { url?: string | boolean }) {
  // TODO replace with a call to the twitter API
  if (!url) {
    return null;
  }

  const className =
    "w-full h-64 bg-base-100 rounded-lg my-2 flex items-center justify-center";

  if (process.env.NEXT_PUBLIC_TESTING === "E2E") {
    return <div className={className}>iFrame for preview of {url}</div>;
  }

  return (
    <>
      <iframe
        className={className}
        src={`https://twitframe.com/show?url=${encodeURIComponent(
          url as string
        )}`}
      />
    </>
  );
}
