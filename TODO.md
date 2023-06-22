# TODO

Below are the upcoming features and improvements.

## Now

- etc: double check links (repos)

- test various auth states
- Test no-anon UI
- Test repo overrides
- More API-only tests, with malicious, nested validation requests

- Create a kitchen sink and test it
- Tests for regex validation

- kitchen sink: test empty tags, test hidden contribs
- Move ETC-only contributions/tests elsewhere
- Better option for APIs / passing data to prMetadata for PR messages
- Cleanup, replace all `any` types
- update docs, use "nocode" somewhere
- check if we need "Request user authorization (OAuth) during installation" (hint; we dont)

## Next

- i18n support (ETC)
- Add contributor name to ETC prs
- Single repo layout
- Poll Tweets
- Thread Tweets
- Tweet Threads
- Option to add tags to PR (e.g. Content, Bot)
- User access token refreshing
- Collapse dropdown if sub-item not selected

## Later

- Dynamic loading of configs from github
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

## Maybe

- handle repo owner/repo/name conflicts, "slug" attribute?
- Contribution-specific authorization
- Allow multiple repos, set up a public contribunator instance, with config updates
- github.contributions.app, allow anyone to submit PR config, with form builder
- Option to only allow maintainers or certain github accounts to make contribution based on repo
- support private repos
