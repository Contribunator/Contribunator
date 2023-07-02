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
    <label className="label space-x-6 font-bold" htmlFor={name}>
      {title && (
        <span className="label-text text-left opacity-60">{title}</span>
      )}
      {error ? (
        <ErrorMessage error={error} />
      ) : (
        info && (
          <span className="label-text-alt text-right opacity-60">
            {!infoLink && info}
            {!!infoLink && (
              <a
                target="_blank"
                className="flex hover:underline items-center"
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
