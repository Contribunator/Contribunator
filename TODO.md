# TODO

Below are the upcoming features and improvements.

### ETC Cleanup

- i18n support (ETC)
- Merge form config like twitter for all contributions, standardize contributions
- Add contributor name to prs
- Move ETC-only contributions/tests elsewhere?
- ETC-config specific tests, Test video with no tags

### Code Quality / Polish

- test it works with `field`, `fields` fields and other fuckery
- Better typing in decorated form data
- Cleanup, replace all `any` types
- Refactor tests
- Convert the has/hasNo back to regex now we don't need to serialize?
- Separate serer and client side code? (commit, `fetchOnServer`, etc.)
- Modularize field types
- Collapse dropdown if sub-item not selected

### Update Docs

- Have a seperate docs folder, generate docs?
- use "nocode" somewhere
- Add a note about enabled delete branches
- update need to "Request user authorization (OAuth) during installation" (we dont)
- don't need to opt-out of refresh user access token

### Tweets

- Disable Quote, Meida, etc.
- Poll Tweets
- Thread Tweets

### General Features

- nicer logtail output (make sure it logs everything) pending cfworker
- Addition of generic uploads; media, animation, GIFs, video via LFS
- merge trigger actions (delete the merged branch)
- Option to disable customTitle/message
- Contribution-specific labels
- Code, Radios, Checkbox, Number (range)
- Required ALT image field option
- Checkbox to Star Repo `starRepoForAuthenticatedUser`
- Option to add merge schedule date
- field specific image paths

## Contribunator v1

- OG Image
- button for github repos to generate a form screenshot
- Dynamic loading of configs from github via yaml
- Themes picker, daisy-ui compatible, and rounded etc.
- handle repo owner/repo/name conflicts, "slug" attribute?
- Option to only allow maintainers or certain github accounts to make contribution based on repo
- Contribution-specific authorization
- Allow multiple repos, set up a public contribunator instance, with config updates
- Single repo layout
- Form builder

## Judgement Day

- Custom JS for PR transforms
- Appprovals UI
- CRUD
- support private repos

## Rise of the Machines

- 😎
