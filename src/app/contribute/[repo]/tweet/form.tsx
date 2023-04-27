"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  repo: string;
};

export default function TweetForm(props: Props) {
  // initialize with empty state
  // TODO manage state updates
  const [state, setState] = useState({ text: "" });
  const path = usePathname();

  async function handleSubmit() {
    // post the state to /submit api
    // console.log("submitting", state, path);
    const res = await fetch(`${path}/submit`, {
      method: "POST",
      body: JSON.stringify(state),
    });
    console.log("got", await res.json());
  }

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setState({ text: e.target.value })}
        value={state.text}
        className="input-bordered input"
      />
      <button className="btn" onClick={() => handleSubmit()}>
        Click Me
      </button>
      {<pre>{JSON.stringify({ state, props }, null, 2)}</pre>}
    </div>
  );
}
