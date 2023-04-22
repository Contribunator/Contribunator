"use client";

import { useState } from "react";

type Props = {
  repo: string;
  type: string;
};

const Commit = (props: Props) => {
  const [data, setData] = useState<any>({});

  async function doTheThing() {
    setData({ loading: true });
    try {
      const res = await fetch("/api/contribute", {
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
      setData({ error: e });
    }
  }

  return (
    <div>
      <button onClick={() => doTheThing()} className="btn btn-primary">
        Do the thing
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default Commit;
