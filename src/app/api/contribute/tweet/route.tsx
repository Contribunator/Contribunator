import transformToPR from "@/contributions/tweet/transformToPR";
import pullRequestHandler from "@/lib/pullRequestHandler";

const POST = pullRequestHandler(transformToPR);

export { POST };
