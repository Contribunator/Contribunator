import Header from "@/components/header";
import "./globals.css";
import config from "@/config";
import Footer from "@/components/footer";

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
          {/* <Header /> */}
          <div className="max-w-xl w-full px-2">
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
