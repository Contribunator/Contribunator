import { getConfig } from "@/lib/config";
export const generateStaticParams =
  process.env.NODE_ENV !== "development"
    ? async () => {
        const { repos } = getConfig();
        return Object.keys(repos).map((repo) => ({ repo }));
      }
    : undefined;

export { default as default } from "@/components/layouts/contributionLayout";
