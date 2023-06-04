"use server";

import { TransformOutputs, TransformInputs } from "@/lib/pullRequestHandler";

export default async function transformGenericToPR(
  props: TransformInputs
): Promise<TransformOutputs> {
  const commit = props.config.contribution.options?.commit;

  if (!commit) {
    throw new Error("Contribution has no commit method defined");
  }

  // TODO automatically parse JSON / YAML etc. ?
  // TODO automatically infer iamge types

  const { files, images } = await commit(props);

  return { files, images };
}
