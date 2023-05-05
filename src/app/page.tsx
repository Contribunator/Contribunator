import Link from "next/link";

export default function Home() {
  return (
    <div className="cell cell-hero">
      <h1 className="title">Welcome</h1>
      <p className="my-6">
        This is some welcome text. Todo, some information about login and shit.
      </p>
      <Link href="/contribute" className="btn btn-primary btn-lg">
        Contribute
      </Link>
    </div>
  );
}
