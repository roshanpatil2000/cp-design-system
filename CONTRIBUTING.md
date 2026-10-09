# Contributing Guide

Thank you for your interest in contributing to this project! 🎉

This project aims to provide a consistent, reusable, and type-safe design system that works across **React (Web) and React Native (Mobile)**.

We welcome contributions of all kinds, including new components, bug fixes, design token improvements, documentation, accessibility enhancements, tests, and performance optimizations.

Please read this guide before submitting a contribution.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Project Goals](#project-goals)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Component Development](#component-development)
- [Design Tokens and Theming](#design-tokens-and-theming)
- [Cross-Platform Compatibility](#cross-platform-compatibility)
- [TypeScript Guidelines](#typescript-guidelines)
- [Testing](#testing)
- [Commit Convention](#commit-convention)
- [Branching Strategy](#branching-strategy)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Versioning and Releases](#versioning-and-releases)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Security](#security)
- [Questions and Support](#questions-and-support)

## Code of Conduct

All contributors are expected to maintain a respectful, inclusive, and collaborative environment.

Please:

- Be respectful and constructive in discussions.
- Provide helpful feedback during code reviews.
- Welcome contributors with different experience levels.
- Focus discussions on code quality, usability, accessibility, and maintainability.
- Avoid harassment, discrimination, and inappropriate behavior.

## Project Goals

The primary goal of this project is to provide a shared design system for React and React Native applications.

The design system should prioritize:

- **Consistency:** Maintain a unified design language across platforms.
- **Reusability:** Provide components that can be reused across projects.
- **Type safety:** Provide reliable TypeScript definitions and developer-friendly APIs.
- **Accessibility:** Support accessible interactions and appropriate platform semantics.
- **Extensibility:** Allow applications to customize themes, tokens, and component behavior.
- **Performance:** Minimize unnecessary rendering and runtime overhead.
- **Developer experience:** Provide clear documentation, predictable APIs, and straightforward installation.
- **Compatibility:** Avoid unnecessary breaking changes for existing consumers.

Contributions should align with these goals.

## Getting Started

### Prerequisites

Before contributing, ensure that you have:

- Git installed.
- A supported Node.js version.
- The package manager used by this repository.
- Familiarity with React and React Native.
- Basic knowledge of TypeScript.
- Any additional tools required by the project's development and testing setup.

### 1. Fork the Repository

Fork the repository on GitHub and clone your fork.

```bash
git clone <your-fork-url>
cd <repository-name>
```

Add the original repository as an upstream remote:

```bash
git remote add upstream <original-repository-url>
```

If you already have direct repository access, you can clone the original repository instead.

### 2. Install Dependencies

Install dependencies using the package manager configured for the project.

For npm:

```bash
npm install
```

Use the repository's existing lockfile and package manager. Avoid introducing additional lockfiles without agreement from the maintainers.

### 3. Create a Branch

Create a descriptive branch for your contribution.

```bash
git checkout -b feature/add-avatar-component
```

See the [Branching Strategy](#branching-strategy) section for naming conventions.

### 4. Start Development

Refer to the scripts defined in `package.json`.

Common examples include:

```bash
npm run dev
npm run build
npm run test
npm run lint
```

These commands are examples only. Run the scripts supported by the repository.

Before submitting changes, verify that the relevant build, tests, and linting checks pass.

## Development Guidelines

### General Principles

- Keep changes focused and easy to review.
- Follow existing architectural and naming conventions.
- Prefer simple, maintainable implementations.
- Avoid unnecessary dependencies.
- Do not introduce unrelated refactoring into feature pull requests.
- Update documentation when public APIs or component behavior change.
- Consider accessibility and platform-specific behavior from the beginning.
- Avoid introducing platform-specific limitations into shared APIs without a clear reason.

### Component API Design

Public component APIs should be predictable and consistent.

When designing component props:

- Use clear, descriptive names.
- Follow established React and React Native conventions.
- Prefer explicit types over loosely typed APIs.
- Provide sensible defaults where appropriate.
- Avoid unnecessary required props.
- Preserve compatibility with existing components.
- Document platform-specific limitations.
- Avoid exposing internal implementation details through public APIs.

For example, a shared component might expose a consistent API:

```tsx
<Button variant="primary" size="medium" disabled={false} onPress={handlePress}>
  Save changes
</Button>
```

The example is illustrative. Use the interaction props and naming conventions established by the existing library. For instance, a web-specific component may use `onClick`, while a cross-platform component may standardize on `onPress`.

### Component Responsibilities

Each component should have a clear purpose.

- Keep components focused on a single responsibility.
- Extract shared logic when doing so improves maintainability.
- Avoid duplicating styling or behavior across components.
- Avoid overly complex conditional rendering.
- Keep internal implementation details private unless they are intentionally part of the public API.

## Component Development

When introducing a new component, consider the following checklist.

### Required Considerations

- [ ] Define the component's purpose and expected behavior.
- [ ] Define and document its TypeScript props.
- [ ] Support the intended React and React Native platforms.
- [ ] Follow the design system's existing token and theming conventions.
- [ ] Handle disabled, loading, error, and empty states where applicable.
- [ ] Consider accessibility and keyboard or touch interactions.
- [ ] Add tests for important behavior.
- [ ] Add or update usage documentation.
- [ ] Export the component through the appropriate public entry point.
- [ ] Verify that the production build includes the component correctly.

### Component Naming

Use consistent naming conventions.

Examples:

- `Button`
- `TextField`
- `Checkbox`
- `Avatar`
- `Card`
- `Modal`
- `Typography`

Use PascalCase for component names and follow the repository's existing file-naming conventions.

Avoid creating multiple components that provide substantially the same functionality without a clear distinction.

## Design Tokens and Theming

Design tokens are the foundation of a consistent design system.

Examples include:

- Colors
- Typography
- Spacing
- Border radii
- Borders
- Shadows
- Opacity
- Component dimensions
- Breakpoints, where applicable

### Token Guidelines

- Prefer existing tokens over hardcoded values.
- Use semantic tokens where appropriate, such as `primary`, `background`, and `text`.
- Keep token naming consistent across platforms.
- Avoid duplicating equivalent token definitions.
- Preserve theme consistency when adding new tokens.
- Document changes that affect the public theming API.
- Consider light and dark themes if supported by the project.

For example:

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
```

This example is illustrative. Follow the repository's actual token structure and naming conventions.

### Theme Compatibility

When modifying tokens or theme configuration:

- Verify that existing components continue to render correctly.
- Avoid silently changing the meaning of existing tokens.
- Keep web and native theme behavior aligned where intended.
- Document any migration requirements.
- Add tests for important token transformations or theme behavior.

## Cross-Platform Compatibility

Cross-platform compatibility is a core requirement of this project.

Contributions should work consistently across React on the web and React Native on supported mobile platforms unless the component is explicitly platform-specific.

### React and React Native

When implementing shared components:

- Prefer shared logic and types where practical.
- Use platform-specific implementations only when necessary.
- Keep public APIs consistent across platforms whenever possible.
- Account for differences in layout, events, accessibility, and rendering.
- Avoid relying on browser-only APIs in shared React Native code.
- Avoid relying on native-only APIs in web implementations.
- Verify styles and interactions on each supported platform.

### Platform-Specific Code

If platform-specific implementations are necessary, keep them explicit and follow the project's conventions.

React Native supports platform-specific file extensions such as:

```text
Button.tsx
Button.web.tsx
Button.native.tsx
```

Use this pattern only if the repository's bundler, build configuration, and module resolution support it.

Platform-specific code should provide equivalent intended behavior wherever feasible.

### Styling

Follow the styling solution already adopted by the project.

Whether the library uses StyleSheet, CSS, NativeWind, a theme-based styling system, or another approach:

- Avoid mixing styling approaches without a clear reason.
- Prefer shared design tokens over duplicated values.
- Verify platform-specific styling behavior.
- Keep styling predictable and maintainable.
- Avoid unnecessary runtime styling calculations.

## TypeScript Guidelines

TypeScript is important for maintaining a reliable public API.

Please follow these guidelines:

- Provide meaningful types for public props and exported APIs.
- Avoid `any` unless there is a justified reason.
- Prefer `unknown` when the type of an external value is uncertain.
- Use appropriate utility types where they improve clarity.
- Preserve useful type inference for consumers.
- Avoid unnecessarily complex generic types.
- Handle optional props and nullable values intentionally.
- Ensure exported types are included in the package's public API when appropriate.

For example:

```tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}
```

This example is illustrative. Adapt the types to the actual component implementation and supported platforms.

Public types should accurately reflect runtime behavior.

## Dependencies and Package Size

Before introducing a new dependency:

1. Check whether existing dependencies or platform APIs can solve the problem.
2. Evaluate maintenance status and compatibility.
3. Consider bundle size and runtime overhead.
4. Verify compatibility with React and React Native.
5. Explain why the dependency is necessary in the pull request.

For a reusable npm library, avoid bundling dependencies that consumers should provide themselves.

Dependencies such as React and React Native may need to be declared as peer dependencies, depending on the library architecture and build setup.

Do not change peer dependency ranges without checking compatibility and discussing potentially breaking changes with the maintainers.

## Testing

All contributions should include appropriate testing.

Depending on the change, this may include:

- Unit tests
- Component behavior tests
- Type-checking
- Web rendering tests
- React Native component tests
- Accessibility tests
- Build and package validation
- Manual verification on supported platforms

### Testing Guidelines

- Add tests for new components and meaningful behavior.
- Update tests when existing behavior changes.
- Include regression tests for bug fixes where practical.
- Test important prop combinations and edge cases.
- Verify disabled and interactive states.
- Test theme changes when relevant.
- Verify platform-specific behavior.
- Avoid tests that depend unnecessarily on internal implementation details.

Do not claim that tests pass unless they have actually been executed.

If a test cannot be run locally, explain the limitation in the pull request.

## Commit Convention

Use clear, descriptive commit messages. We recommend the Conventional Commits format:

```text
<type>(optional-scope): <description>
```

Common commit types:

| Type       | Purpose                                                          |
| ---------- | ---------------------------------------------------------------- |
| `feat`     | Introduces a feature                                             |
| `fix`      | Fixes a bug                                                      |
| `docs`     | Updates documentation                                            |
| `refactor` | Refactors implementation                                         |
| `test`     | Adds or updates tests                                            |
| `perf`     | Improves performance                                             |
| `style`    | Changes formatting or styling without changing intended behavior |
| `chore`    | Performs maintenance                                             |
| `build`    | Changes build configuration                                      |
| `ci`       | Updates continuous integration                                   |

Examples:

```bash
git commit -m "feat(button): add loading state"
git commit -m "fix(theme): resolve dark mode token issue"
git commit -m "docs: add text field examples"
git commit -m "test(avatar): cover fallback rendering"
```

Keep commits focused and avoid vague messages such as `updates` or `fixes`.

## Branching Strategy

Use descriptive branch names.

| Prefix      | Purpose               | Example                     |
| ----------- | --------------------- | --------------------------- |
| `feature/`  | New functionality     | `feature/add-tooltip`       |
| `fix/`      | Bug fixes             | `fix/button-disabled-state` |
| `refactor/` | Internal improvements | `refactor/theme-provider`   |
| `docs/`     | Documentation         | `docs/component-guidelines` |
| `test/`     | Test changes          | `test/checkbox-component`   |
| `chore/`    | Maintenance           | `chore/update-dependencies` |

Create branches from the repository's designated base branch.

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

Replace `main` with the appropriate branch if the repository uses a different workflow.

## Pull Request Guidelines

Before submitting a pull request, verify the following:

- [ ] The change has a clear purpose.
- [ ] The implementation follows the project's conventions.
- [ ] TypeScript types have been updated where necessary.
- [ ] Relevant tests have been added or updated.
- [ ] Relevant tests and quality checks have been run.
- [ ] The component works on applicable platforms.
- [ ] Documentation and examples have been updated.
- [ ] Public exports have been updated where necessary.
- [ ] No unrelated files or generated artifacts are included.
- [ ] Potential breaking changes are documented.

### Submitting a Pull Request

Push your branch:

```bash
git push origin feature/your-feature-name
```

Open a pull request against the appropriate target branch.

Include:

**Description**

- What changed?
- Why is the change needed?
- How does it improve the design system?

**Testing**

- What tests or checks were performed?
- Which platforms were verified?
- Were any checks skipped?

**Screenshots or Examples**

For visual components, include screenshots, usage examples, or recordings when helpful.

**Breaking Changes**

Describe incompatible API changes, removed props, renamed tokens, dependency changes, or migration requirements.

**Related Issues**

Link any related issues or discussions.

### Code Review

Maintainers may request changes before approving a contribution.

Please respond constructively to feedback and keep discussions focused on the quality, consistency, and long-term maintainability of the design system.

## Versioning and Releases

This package is intended for distribution through npm. Published releases should preserve predictable behavior for consumers.

We recommend following Semantic Versioning (SemVer):

`MAJOR.MINOR.PATCH`

- **MAJOR:** Introduces incompatible public API changes.
- **MINOR:** Adds backward-compatible functionality.
- **PATCH:** Includes backward-compatible bug fixes.

Examples:

- Adding a new component without breaking existing APIs may qualify as a minor release.
- Fixing an existing component without changing its public contract may qualify as a patch release.
- Removing a public prop or changing its behavior incompatibly may require a major release.

The actual release process, version updates, changelog generation, and npm publishing permissions are managed by the maintainers.

Contributors should not publish packages or modify release versions unless explicitly authorized.

Before a release, maintainers should verify:

- The package builds successfully.
- Tests and type checks pass.
- Public exports are correct.
- TypeScript declarations are included as intended.
- Peer dependencies are appropriate.
- Package contents exclude unnecessary development files.
- Documentation and release notes reflect the changes.

## Reporting Bugs

Before opening a bug report, search existing issues to avoid duplicates.

Include the following information:

- **Title:** A concise description of the issue.
- **Package version:** The version being used.
- **Environment:** React version, React Native version, platform, and relevant tooling.
- **Steps to reproduce:** Minimal steps or a reproducible example.
- **Expected behavior:** What should happen.
- **Actual behavior:** What happens instead.
- **Additional information:** Relevant logs, screenshots, or stack traces.

Remove sensitive information before sharing logs or examples.

Use the repository's issue templates if available.

## Suggesting Features

Feature suggestions are welcome.

When proposing a new component, token, or capability:

- Explain the problem it solves.
- Describe the intended behavior and use cases.
- Explain whether it should support web, native, or both.
- Include example APIs or designs when useful.
- Consider accessibility, theming, and backward compatibility.
- Check whether similar functionality already exists.

For substantial API or architectural changes, discuss the proposal with the maintainers before implementation.

## Security

Do not include secrets, credentials, access tokens, or private user information in source code, tests, issues, or pull requests.

If you discover a security vulnerability, report it privately through the repository's configured security reporting channel, if available.

Avoid publicly disclosing exploitable vulnerabilities before the maintainers have had an opportunity to investigate.

## Questions and Support

If you need help:

- Read the `README.md` and relevant documentation.
- Search existing issues and discussions.
- Open an issue or discussion if the repository supports it.
- Ask the maintainers before making substantial architectural changes.

Thank you for contributing!

Every contribution, whether it is a component, bug fix, design token improvement, test, or documentation update, helps make this design system more useful to the community.
