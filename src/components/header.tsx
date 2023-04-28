import Link from "next/link";
import UserInfo from "./userInfo";
import { Route } from "next";

const Header = () => {
  return (
    <header className="flex justify-between bg-secondary bg-opacity-20 p-2 text-lg">
      <nav className="flex items-center space-x-2">
        {[
          { name: "Home", href: "/" },
          { name: "Contribute", href: "/contribute" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href as Route}
            className="hover:underline"
          >
            {link.name}
          </Link>
        ))}
      </nav>
      {/* @ts-expect-error Server Component */}
      <UserInfo />
    </header>
  );
};
export default Header;
