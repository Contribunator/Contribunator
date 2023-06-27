# TODO

Below are the upcoming features and improvements.

## Merge

- Way to pass fetched data to prMetadata for PR messages (use `fetchDataOnServer`)
- Update commit to pass all details in an object for easy manipulation
- Refactor commits to use new `fetchDataOnServer` and extracted images
- Update Videos to have better PR names
- Rename "Fields" to "Data" for parsed field data.

- Test demo/etc works with new env vars
- Move ETC-only contributions/tests elsewhere?

## Then Update Docs

- use "nocode" somewhere
- Add a note about enabled delete branches
- update need to "Request user authorization (OAuth) during installation" (we dont)
- don't need to out-out of refresh user access token

## Next Features

- Option to request add tags and review for PRs
- i18n support (ETC)
- Add contributor name to ETC prs
- Single repo layout
- Poll Tweets
- Thread Tweets
- Tweet Threads
- Collapse dropdown if sub-item not selected
- Cleanup, replace all `any` types

## Later

### Chores

- merge images and collection logic
- Improved error/conf feedback in the UI (not alert)
- OG Image
- Convert the has/hasNo back to regex now we don't need to serialize?
- Separate serer and client side code? (commit, `fetchOnServer`, etc.)

### Features

- Addition of media, animation, GIFs, video
- Dynamic loading of configs from github?
- Themes picker, daisy-ui compatible, and rounded etc.
- Required ALT image field
- Checkbox to Star Repo `starRepoForAuthenticatedUser`
- Option to add merge schedule date
- Code, Radios, Checkbox, Number (range)
- CRUD

## v1

- handle repo owner/repo/name conflicts, "slug" attribute?
- Contribution-specific authorization
- Allow multiple repos, set up a public contribunator instance, with config updates
- github.contributions.app, allow anyone to submit PR config, with form builder
- Option to only allow maintainers or certain github accounts to make contribution based on repo
- support private repos
- project structure, sandbox userland code (e.g. commit)

- button for github repos to generate a form screenshot

## Judgement Day

- Appprovals UI

## Rise of the Machines

- AI to generate description/suggest improvement
- AI to generate PRs on a schedule based on past PRs
- API Keys
