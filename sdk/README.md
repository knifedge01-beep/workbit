# @thedatablitz/workbit-sdk

Workbit SDK for JavaScript/TypeScript.

## Install (from GitHub Packages)

In the repo where you want to use the SDK:

1. **Configure npm to use GitHub Packages for `@thedatablitz/workbit-sdk— add to the project's `.npmrc` (or your user `~/.npmrc`):

   ```
   @thedatablitz/workbit-sdkistry=https://npm.pkg.github.com/
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

2. **Set a GitHub token** with `read:packages` (e.g. a Personal Access Token):

   ```bash
   export GITHUB_TOKEN=ghp_your_token_here
   ```

3. **Install the package**:

   ```bash
   npm install @thedatablitz/workbit-sdk
   ```

> **Note:** GitHub Packages requires scoped package names, so the package is published as `@thedatablitz/workbit-sdk`. Use `npm install @thedatablitz/workbit-sdk` (not `workbit-sdk`).

## Publish (maintainers)

From this directory:

```bash
export GITHUB_TOKEN=ghp_your_token_with_write_packages
npm run build
npm publish
```

Ensure `repository.url` in `package.json` points to your GitHub org/repo, and the scope in `name` (e.g. `@thedatablitz/workbit-sdkatches your GitHub org.
