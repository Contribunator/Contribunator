import submitTweet from "@/contributions/tweet/submit";
import pullRequestHandler from "@/lib/pullRequestHandler";

const POST = pullRequestHandler(submitTweet);

export { POST };
