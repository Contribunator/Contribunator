import withFormPage from "@/components/form/withFormPage";

import FormContainer from "@/components/form/formContainer";
import FormClient from "@/components/form/formClient";

import { getRepo } from "@/lib/config";

export const generateStaticParams =
  process.env.NODE_ENV !== "development"
    ? async ({ params: { repo } }: any) => {
        const {
          repo: { contributions },
        } = getRepo(repo);
        return Object.keys(contributions).map((contribution) => ({
          contribution,
        }));
      }
    : undefined;

export default withFormPage(FormContainer, FormClient);
