import { notFound } from "next/navigation";

import { getConfig } from "@/lib/config";
import useUser from "@/lib/useUser";

type PageProps = {
  params: {
    repo: string;
    contribution: string[];
  };
};

export default function withFormPage(
  Page: React.FC<any>,
  Form: React.FC<any>,
  contributionType?: string
) {
  // Nextjs 13: Optional route parameters are not yet supported for now
  // we use this workaround using [[...type]], trigger 404 if missing
  return async function FormPage({
    params: { repo, contribution: fragments = [] },
  }: PageProps) {
    const [contribution = contributionType, ...rest] = fragments;
    let config;
    try {
      if (!contribution || rest.length > 0) throw new Error();
      config = getConfig(repo, contribution);
    } catch {
      console.log("route not found");
      notFound();
    }
    const user = await useUser();

    return (
      <Page {...{ user, config }}>
        {/* needs to be rendered seperately because it's a client side component */}
        {/* for this reason we can't pass the whole config, it gets queried again client side */}
        <Form {...{ repo, user, contribution }} />
      </Page>
    );
  };
}
