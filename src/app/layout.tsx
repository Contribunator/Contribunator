import "./globals.css";
import config from "@/util/config";

export const metadata = {
  title: config.title,
  description: config.description,
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen justify-center items-center text-center">
          <div className="max-w-xl w-full px-2">{children}</div>
        </div>
      </body>
    </html>
  );
}
