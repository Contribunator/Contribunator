import Footer from "@/components/common/footer";

// @ts-ignore
// import { highlightProject } from "@/lib/env";
// only load highlight if we need it

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* {highlightProject && (
        <HighlightInit
          projectId={highlightProject}
          tracingOrigins
          networkRecording={{
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: [],
          }}
        />
      )} */}
      <html lang="en">
        <body className="flex min-h-screen text-center items-center flex-col py-6">
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
