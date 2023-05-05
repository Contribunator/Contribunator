import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default async function Contribution({ children }: Props) {
  // TODO return empty page if the type isn't supported for this repo
  // Trigger notFound() if the type isn't supported for this repo

  return (
    <div className="min-h-screen py-6 space-y-6">
      {children}
      <Link className="btn" href="/contribute">
        Go Back
      </Link>
    </div>
  );
}
