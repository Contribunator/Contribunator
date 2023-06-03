export default function GenericFormContainer({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>Generic Form Goes Here</div>
      {/* <pre className="text-left">{JSON.stringify(props, null, 2)}</pre> */}
      {children}
    </>
  );
}
