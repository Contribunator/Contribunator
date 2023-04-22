import Commit from "@/components/commit";

export const metadata = {
  title: "Create thing",
};

type Props = {
  params: {
    repo: string;
    type: string;
  };
};

const Page = async (props: Props) => {
  return (
    <main>
      <Commit {...props.params} />
    </main>
  );
};
export default Page;
