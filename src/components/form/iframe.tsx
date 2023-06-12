import { e2e } from "@/lib/testEnv";

export default function Iframe({ url }: { url?: string }) {
  // TODO replace with a call to the twitter API
  if (!url) {
    return null;
  }

  const className =
    "w-full h-64 bg-base-100 rounded-lg my-2 flex items-center justify-center";

  if (e2e) {
    return (
      <div className={`${className} break-all overflow-hidden p-5`}>
        iframe: {url}
      </div>
    );
  }

  return <iframe className={className} src={url} />;
}
