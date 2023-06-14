import "./globals.css";

import { getConfig } from "@/lib/config";

const config = getConfig();

export const metadata = {
  title: config.title,
  description: config.description,
  icons: {
    icon: "/favicon.svg",
  },
};

export { default as default } from "@/components/layouts/rootLayout";
