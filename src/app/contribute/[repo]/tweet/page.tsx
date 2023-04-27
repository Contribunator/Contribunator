import TweetForm from "./form"

type Props = {
  params: {
    repo: string
  }
  searchParams: {
    [key: string]: string
  }
};

export default function TweetPage(props: Props) {
  // TODO might need to get some specific information about this type of update to pass to client form
  // initialize with empty state
  return (
    <div>
      SRC!
      {/* Let's Tweet!
      <div className="btn" onClick={() => handleUpdate()}>
        Commit!
      </div> */}
      {<pre>{JSON.stringify(props, null, 2)}</pre>}
      <TweetForm repo={props} />
    </div>
  );
}
