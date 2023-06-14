// TODO dont use any

export default function SubmittedTestData({
  pr: { body, title },
  commit: { branch, changes },
}: any) {
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
        <div>
          <div className="font-bold">PR Message:</div>
          {body.split("\n").map((t: string) => (
            <span key={t}>
              {t}
              <br />
            </span>
          ))}
        </div>
        {Object.entries(changes[0].files).map(([file, content]: any) => (
          <div key={file}>
            <div className="font-bold">{file}</div>
            {content.split("\n").map((t: string) => (
              <>
                {t}
                <br />
              </>
            ))}
          </div>
        ))}
      </pre>
    </>
  );
}
