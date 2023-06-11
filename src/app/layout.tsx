import "./globals.css";
import config from "@/lib/config";

export const metadata = {
  title: config.title,
  description: config.description,
  icons: {
    icon: "/favicon.svg",
  },
};

export { default as default } from "@/components/layouts/rootLayout";
