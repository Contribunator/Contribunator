import "./globals.css";

import getConfig from "@/lib/config";

export async function generateMetadata() {
  const config = await getConfig();
  return {
    title: config.title,
    description: config.description,
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export { default as default } from "@/components/layouts/rootLayout";
