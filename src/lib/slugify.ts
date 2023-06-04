export default function slugify(
  str: string,
  opts?: { append?: string | number; slice?: number; join?: string }
) {
  const { append, slice, join } = { slice: 7, join: "-", ...opts };

  const slugified = str
    .trim()
    .toLowerCase()
    .replace(/https?:\/\/([^\/\s]+)(\/\S*)?/g, "$1") // strip long urls
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove consecutive hyphens
    .split("-") // split into an array
    .slice(0, slice) // slice to the first n words
    .join(join); // join into a string

  if (append) {
    return `${slugified}${join}${append}`;
  }

  return slugified;
}
