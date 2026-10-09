# Changesets

Run `yarn changeset` after making a change you want to release. Pick the bump type (patch/minor/major) and write a one-line summary; it ends up in `CHANGELOG.md`.

When changesets land on `main`, the Release workflow opens a "Version Packages" PR. Merging that PR publishes to npm.
