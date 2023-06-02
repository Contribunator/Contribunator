import withFormPage from "@/components/form/withFormPage";

import TweetFormContent from "@/contributions/tweet/formContent";
import TweetFormContainer from "@/contributions/tweet/formContainer";

export default withFormPage(TweetFormContainer, TweetFormContent, "tweet");
