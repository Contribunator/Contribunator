export default function Version() {
  return (
    <div className="mt-10 text-xs font-mono text-base-300">
      <span>{process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 6)}</span>
    </div>
  );
}
