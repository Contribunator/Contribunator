import { PrMetadata, Contribution } from "@/types";

export default function generatePrMetadata({
  title,
  form,
}: Omit<Contribution, "schema" | "prMetadata">): PrMetadata {
  const prMetadata: PrMetadata = (fields) => {
    const itemName = fields.title || fields.name;
    return {
      title: `Add ${title}${itemName ? `: ${itemName}` : ""}`,
      message: `This PR adds a new ${title}:

${Object.entries(form.fields)
  .map(([key, field]) => {
    const { title = key } = field;
    const value = fields[key];

    if (!value) {
      return null;
    }

    let valueString = value;
    if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        valueString = value.join(", ");
      } else {
        valueString = valueString.length + " item(s)";
      }
    } else if (typeof value === "object") {
      valueString = "✔";
    }
    if (typeof value === "boolean") {
      valueString = value ? "✔" : "❌";
    }
    if (valueString.length > 250) {
      valueString = valueString.slice(0, 250) + "... [trimmed]";
    }

    return `## ${title}\n${valueString}`;
  })
  .filter((i) => i)
  .join("\n\n")}`,
    };
  };
  return prMetadata;
}
