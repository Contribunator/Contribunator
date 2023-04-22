import Commit from "@/components/commit";

export const metadata = {
  title: "Create thing",
};

type Props = {
  repo: string;
  type: string;
};

const Page = async (props: Props) => {
  return (
    <main>
      <Commit {...props} />
      {/* <pre>
        {JSON.stringify(
          json.map(({ path, sha }) => ({ path, sha })),
          null,
          2
        )}
      </pre> */}
    </main>
  );
};
export default Page;
