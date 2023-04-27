import Link from "next/link";
import UserInfo from "./userInfo";

const Header = () => {
  return (
    <header className="flex justify-between bg-gray-100 bg-opacity-20 p-2 text-lg">
      <nav className="flex items-center space-x-2">
        {[
          { name: "Home", href: "/" },
          { name: "Contribute", href: "/contribute" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
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
