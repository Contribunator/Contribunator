export default function Iframe({ url }: { url?: string }) {
  // TODO replace with a call to the twitter API
  if (!url) {
    return null;
  }

  const className =
    "w-full h-64 bg-base-100 rounded-lg my-2 flex items-center justify-center";

  if (process.env.NEXT_PUBLIC_TESTING === "E2E") {
    return (
      <div className={`${className} break-all overflow-hidden p-5`}>
        iframe: {url}
      </div>
    );
  }

  return <iframe className={className} src={url} />;
}
