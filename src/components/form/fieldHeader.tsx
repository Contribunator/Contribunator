import { HiExternalLink } from "react-icons/hi";

export default function FieldHeader({
  name,
  error,
  title,
  info,
  infoLink,
}: {
  name?: string;
  error?: string;
  title?: string;
  info?: string;
  infoLink?: string;
}) {
  return (
    <label className="label" htmlFor={name}>
      {title && <span className="label-text text-left">{title}</span>}
      {error ? (
        <span className="label-text-alt text-error text-right">{error}</span>
      ) : (
        info && (
          <span className="label-text-alt text-right">
            {!infoLink && info}
            {!!infoLink && (
              <a
                target="_blank"
                className="flex gap-2 hover:underline items-center"
                href={infoLink}
              >
                {info}
                <HiExternalLink />
              </a>
            )}
          </span>
        )
      )}
    </label>
  );
}
