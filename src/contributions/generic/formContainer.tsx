export default function GenericFormContainer({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>TODO Generic Form page.</div>
      <pre className="text-left">{JSON.stringify(props, null, 2)}</pre>
      {children}
    </>
  );
}
