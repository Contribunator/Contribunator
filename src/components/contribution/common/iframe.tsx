import { e2e } from "@/lib/env";

export default function Iframe({ url }: { url?: string }) {
  if (!url || !/^(https?):\/\/[^\s/$.?#].[^\s]*$/i.test(url)) {
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
