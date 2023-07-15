import getConfig from "@/lib/config";

export const generateStaticParams =
  process.env.NODE_ENV !== "development"
    ? async ({ params: { repo } }: { params: { repo: string } }) => {
        const {
          repo: { contributions },
        } = await getConfig(repo);
        return Object.keys(contributions).map((contribution) => ({
          contribution,
        }));
      }
    : undefined;

export { default as default } from "@/components/contribution/contributionPage";
