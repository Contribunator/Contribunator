import { HiExternalLink } from "react-icons/hi";
import ErrorMessage, { MixedErrorMessage } from "./errorMessage";

export default function FieldHeader({
  name,
  error,
  title,
  info,
  infoLink,
}: {
  name?: string;
  error?: MixedErrorMessage;
  title?: string;
  info?: string;
  infoLink?: string;
}) {
  if (!title && !error && !info) return null;
  return (
    <label className="label" htmlFor={name}>
      {title && <span className="label-text text-left">{title}</span>}
      {error ? (
        <ErrorMessage error={error} />
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
