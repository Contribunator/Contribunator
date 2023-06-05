"use server";

import { TransformOutputs, TransformInputs } from "@/lib/pullRequestHandler";

export default async function transformGenericToPR(
  props: TransformInputs
): Promise<TransformOutputs> {
  const commit = props.config.contribution.options?.commit;

  if (!commit) {
    throw new Error("Contribution has no commit method defined");
  }

  const { files, images, yaml, json } = await commit(props);

  return { files, images, yaml, json };
}
