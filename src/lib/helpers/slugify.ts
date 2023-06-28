export default function slugify(
  str: string,
  opts?: { append?: string | number | false; slice?: number; join?: string }
) {
  const { append, slice, join } = { slice: 10, join: "-", ...opts };

  const slugified = str
    .trim()
    .toLowerCase()
    .replace(/https?:\/\/([^\/\s]+)(\/\S*)?/g, "$1") // strip long urls
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/(\r\n|\n|\r)/gm, "-") // replace line breaks with hyphens
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove consecutive hyphens
    .split("-") // split into an array
    .filter((word) => word) // remove empty words
    .slice(0, slice) // slice to the first n words
    .join(join); // join into a string

  if (append) {
    return `${slugified}${join}${append}`;
  }

  return slugified;
}
