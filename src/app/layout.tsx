import Header from "@/components/header";
import "./globals.css";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container mx-auto p-2">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
