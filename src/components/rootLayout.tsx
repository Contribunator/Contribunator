import Footer from "@/components/common/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen text-center items-center flex-col py-6">
        <div className="flex flex-auto w-full justify-center items-center">
          <div className="max-w-xl w-full px-2">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
