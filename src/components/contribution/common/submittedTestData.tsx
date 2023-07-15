import { E2ETestResponse } from "@/types";

export default function SubmittedTestData({
  pr: { body, title },
  commit: { branch, changes, author },
}: E2ETestResponse) {
  return (
    <>
      <pre className="bg-base-100 p-4 font-mono text-left text-sm whitespace-pre-wrap space-y-4 flex flex-col overflow-hidden rounded-md">
        <div>
          <div className="font-bold">Commit Message: </div>
          {title}
        </div>
        <div>
          <div className="font-bold">Branch: </div>
          {branch}
        </div>
        {author && (
          <div>
            <div className="font-bold">Author: </div>
            {`${author.name} <${author.email}>`}
          </div>
        )}
        <div>
          <div className="font-bold">PR Message:</div>
          {body}
        </div>
        {Object.entries(changes[0].files).map(([file, content]) => (
          <div key={file}>
            <div className="font-bold">{file}</div>
            {content}
          </div>
        ))}
      </pre>
    </>
  );
}
