# TODO

Below are the upcoming features and improvements.

## Now

- Fix report ordering to match form
- Update test w/ images and report generation
- OG Image
- Improved error/conf feedback in the UI (not alert)
- Collapse dropdown if sub-item not selected
- ensure all reserved `field`s etc are reserved deeply
- getDateStamp / getTimeStamp

### ETC Cleanup

- Addition of generic uploads; media, animation, GIFs, video via LFS
- i18n support (ETC)
- Merge form config like twitter for all contributions, standardize contributions
- Add contributor name to prs
- Move ETC-only contributions/tests elsewhere?

### Polish

### Code QUality

- Cleanup, replace all `any` types
- Refactor tests
- merge images and collection logic
- Convert the has/hasNo back to regex now we don't need to serialize?
- Separate serer and client side code? (commit, `fetchOnServer`, etc.)

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

- Option to disable customTitle/message
- Contribution-specific labels
- Code, Radios, Checkbox, Number (range)
- Required ALT image field
- Checkbox to Star Repo `starRepoForAuthenticatedUser`
- Option to add merge schedule date
- field specific image paths

## Contribunator v1

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
