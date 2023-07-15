export default function slugify(
  str: string,
  opts?:
    | { append?: string | number | false; slice?: number; join?: string }
    | false
) {
  let slice = 10;
  let join = "-";
  let append: string | number | false = false;

  if (opts === false) {
    slice = Infinity;
  } else if (opts && typeof opts === "object") {
    slice = opts.slice || slice;
    join = opts.join || join;
    append = opts.append || append;
  }

  const slugified = str
    .trim()
    .toLowerCase()
    .replace(/https?:\/\/([^\/\s]+)(\/\S*)?/g, "$1") // strip long urls
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
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
