import * as Yup from "yup";

// TODO add branch, committer details etc.

const genericValidation = {
  captcha: Yup.string().required(
    "Please sign in or complete the CAPTCHA check"
  ),
};

export default genericValidation;
