import Footer from "@/components/common/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen text-center items-center flex-col py-6">
        {children}
        <Footer />
      </body>
    </html>
  );
}
