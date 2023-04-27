"use client";

import { useState } from "react";

type Props = {
  repo: string;
}

export default function TweetForm(props: Props) {
  // initialize with empty state
  // TODO manage state updates
  const [state, setState] = useState({ text: "" });
  return (
    <div>
      {/* Let's Tweet!
      <div className="btn" onClick={() => handleUpdate()}>
        Commit!
      </div> */}
      <input type="text" onChange={(e) => setState({text: e.target.value})} value={state.text} className="input input-bordered" />
      <button className="btn" onClick={() => {
        alert('calling api')
      }}>Click Me</button>
      {<pre>{JSON.stringify({state, props}, null, 2)}</pre>}
    </div>
  );
}
