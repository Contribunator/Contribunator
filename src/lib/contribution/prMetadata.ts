import { PrMetadata, FormDataItem } from "@/types";

function deepReport(formData: FormDataItem): string {
  let r = "";
  const report = (fields: FormDataItem, depth = 2) => {
    Object.values(fields).forEach((item) => {
      // we only deal with objects here
      if (typeof item !== "object") {
        return;
      }
      if (item.field) {
        // render the field to markdown
        const heading = "#".repeat(depth < 6 ? depth : 6);
        const str = item.markdown || item.data;
        r += `${heading} ${item.fullTitle}\n${str}\n\n`;
      } else {
        report(item, depth + 0.5);
      }
    });
  };
  report(formData);
  return r.trim();
}

const prMetadata: PrMetadata = ({
  formData,
  config: {
    contribution: { title },
  },
}) => {
  console.log(formData);
  const itemName = formData.title?.data || formData.name?.data;
  return {
    title: `Add ${title}${itemName ? `: ${itemName}` : ""}`,
    message: `This PR adds a new ${title}:

${deepReport(formData)}`,
  };
};

export default prMetadata;
