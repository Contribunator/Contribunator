export default function FlexContainer({
  children,
  centered = false,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={`flex flex-auto w-full justify-center ${
        centered ? "items-center" : ""
      }`}
    >
      <div className="max-w-xl w-full px-2 space-y-6 flex-auto">{children}</div>
    </div>
  );
}
