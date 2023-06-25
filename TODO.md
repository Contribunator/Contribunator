# TODO

Below are the upcoming features and improvements.

## Now

- kitchen sink: test empty tags(?)
- More API-only tests, with malicious, nested validation requests
- tweet options tests
- remove image limit, use validation max
- test reserved fields
- Move ETC-only contributions/tests elsewhere?
- etc: double check links (repos)
- merge images and collection logic
- Update commit to pass all details in an object for easy manipulation
- Automatically create image filename (slugify etc.) and test
- Way to pass fetched data to prMetadata for PR messages (use `fetchDataOnServer`)
- Mocktokit read test data from files for extensibility
- have env vars be validated in config build step
- project structure, sandbox userland code (e.g. commit)
- optimize with dynamic imports everywhere

- update docs, use "nocode" somewhere
  - Add a note about enabled delete branches
  - update need to "Request user authorization (OAuth) during installation" (we dont)
  - don't need to out-out of refresh user access token

## Next

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
- Appprovals UI
- AI to generate description/suggest improvement
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
