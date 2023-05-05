export default function FieldHeader({
  name,
  error,
  title,
  info,
}: {
  name?: string;
  error?: string;
  title?: string;
  info?: string;
}) {
  return (
    <label className="label" htmlFor={name}>
      {title && <span className="label-text text-left">{title}</span>}
      {error ? (
        <span className="label-text-alt text-error text-right">{error}</span>
      ) : (
        info && <span className="label-text-alt text-right">{info}</span>
      )}
    </label>
  );
}
