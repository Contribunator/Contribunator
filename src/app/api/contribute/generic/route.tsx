import transformToPR from "@/contributions/generic/transformToPR";
import pullRequestHandler from "@/lib/pullRequestHandler";

const POST = pullRequestHandler(transformToPR);

export { POST };
