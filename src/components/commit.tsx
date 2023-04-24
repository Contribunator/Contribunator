"use client";

import { useState } from "react";

type Props = {
  repo: string;
  type: string;
};

const Commit = (props: Props) => {
  const [data, setData] = useState<any>({});
  // get the path
  async function doTheThing() {
    setData({ loading: true });
    try {
      // call 'create' API method realtively
      const res = await fetch(`/create/${props.repo}/${props.type}/commit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...props,
          first: "first",
          last: "last",
        }),
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      setData({ error: e.message });
    }
  }

  return (
    <div>
      <button onClick={() => doTheThing()} className="btn btn-primary">
        Do the thing
      </button>
      {data.url && (
        <a href={data.url} target="_blank">
          View PR on GitHub
        </a>
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default Commit;
