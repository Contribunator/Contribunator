# TODO

Below are the upcoming features and improvements.

## Now

- import all field tests into the demo for one giant form
- More API-only tests, with malicious, nested validation requests
- have env vars be validated in config build step

- Mocktokit read test data from files for extensibility
- Move ETC-only contributions/tests elsewhere?

- Automatically create image filename (slugify etc.) and test
- Way to pass fetched data to prMetadata for PR messages (use `fetchDataOnServer`)
- Update commit to pass all details in an object for easy manipulation
- optimize with dynamic imports everywhere, only load requested contribution(s) on page load
- Option to request add tags and review for PRs

## Then Update Docs

- use "nocode" somewhere
- Add a note about enabled delete branches
- update need to "Request user authorization (OAuth) during installation" (we dont)
- don't need to out-out of refresh user access token

## Next Features

- i18n support (ETC)
- Add contributor name to ETC prs
- Single repo layout
- Poll Tweets
- Thread Tweets
- Tweet Threads
- Option to add tags to PR (e.g. Content, Bot)
- Collapse dropdown if sub-item not selected
- Cleanup, replace all `any` types

## Later

- merge images and collection logic
- Required ALT image field
- Dynamic loading of configs from github?
- Improved error/conf feedback in the UI (not alert)
- CRUD
- OG Image
- Convert the has/hasNo back to regex now we don't need to serialize?
- Checkbox to Star Repo `starRepoForAuthenticatedUser`
- Addition of media, animation, GIFs, video
- Automation Integrations
- Option to add merge date
- dynamically load configs / moctokit
- Code
- Radios
- Generic Files
- Checkbox
- Number

## Maybe

- seperate form field tests individually
- handle repo owner/repo/name conflicts, "slug" attribute?
- Contribution-specific authorization
- Allow multiple repos, set up a public contribunator instance, with config updates
- github.contributions.app, allow anyone to submit PR config, with form builder
- Option to only allow maintainers or certain github accounts to make contribution based on repo
- support private repos
- button for github repos to generate a form screenshot
- project structure, sandbox userland code (e.g. commit)

## Judgement Day

- Appprovals UI

## Rise of the Machines

- AI to generate description/suggest improvement
- API Keys
