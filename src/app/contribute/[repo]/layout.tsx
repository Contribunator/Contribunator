import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default async function Contribution({ children }: Props) {
  // TODO return empty page if the type isn't supported for this repo
  // Trigger notFound() if the type isn't supported for this repo

  return (
    <>
      <Link className="btn" href="/contribute">
        Go Back
      </Link>
      <div className="max-w-xl mx-auto bg-slate-200 p-8">{children}</div>
    </>
  );
}
