import config from "@/lib/config";

export const generateStaticParams =
  process.env.NODE_ENV !== "development"
    ? async () => {
        return Object.keys(config.repos).map((repo) => ({ repo }));
      }
    : undefined;

export { default as default } from "@/components/layouts/contributionLayout";
