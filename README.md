# tinyci

Minimal CI built on Github Webhooks

TinyCI is a small continuous integration server which is powered by GitHub
webhooks. It's got badges, testing and redeploy scripts (with support for
executing bash scripts for more complex deployments).

## Usage

First configure TinyCI by modifying the `tinyci.config.js` to include the repos
you want to test and depoly. An example is provided by default. It is suggested
you modify the example.

Once configured start TinyCI using the following commands
(which also installs dependancies)

> npm i && npm start

TinyCI is now started on port `:3000`, you should consult
https://developer.github.com/webhooks/creating/ from here to learn how to point
your webhook to your TinyCI server.

## Status

Status of your builds as a whole can be found at `/status`, individual statuses
can be found at `/status/:repo` where `:repo` is `username-repoName`.

## Badges

Badges can be found at `/badge/:repo` where `:repo` is `username-repoName`.
Badges are returned as an SVG.
