export default function EmbedTweet({ url }: { url: string | false }) {
  // TODO Get using twitter API?
  // console.log(url);
  // TODO scroll to bottom
  return (
    <div className="-mx-6 h-64 bg-slate-300 rounded-lg flex items-center justify-center">
      {!url ? (
        <div className="text-sm text-slate-500">
          Valid quoted tweet preview will appear here
        </div>
      ) : (
        <iframe
          className="w-full h-full"
          src={`https://twitframe.com/show?url=${encodeURIComponent(
            url as string
          )}`}
        />
      )}
    </div>
  );
}
