---
name: conventional-commits-enforcer
description: Validates and generates git commit enforcer messages following Conventional Commits specification with extras rules. Use this skill when creating commits, reviewing commit history, or enforcing commit message standards. Enforces English-only messages, automatic scope inference from file paths, proper structure (header/body/files), and excludes sensitive files (.env, credentials, secrets) from any commit. Triggered on any git commit operation.
license: LICENSE.txt
---

This skill enforces **strict Conventional Commits formatting** for all git commits.
All commit messages **MUST be written in English only**.

The AI MUST always generate commits following the exact structure and rules defined below.

---

# Required Commit Format

```
<type>(<scope>): <description>

<summary>

Files:
- [ADD] path/file.ext: short description
- [MOD] path/file.ext: short description
- [DEL] path/file.ext: short description
- [REN] path/file.ext: short description
```

If no clear scope can be inferred:

```
<type>: <description>
```

---

# Commit Structure Rules

## Header

```
<type>(<scope>): <description>
```

OR

```
<type>: <description>
```

### Header Requirements

* MUST use lowercase
* MUST use imperative mood
* MUST NOT exceed 50 characters
* MUST NOT end with a period
* MUST NOT contain emojis
* MUST NOT contain extra whitespace
* Scope: OMIT if unclear, INFER when possible

---

# Scope Inference

The AI MUST infer scope automatically using:

1. Modified file paths
2. Folder names
3. File types

## Scope Mapping Table

| Path Pattern | Scope |
|--------------|-------|
| src/components/, src/pages/, src/views/ | ui |
| src/router/ | router |
| src/store/, src/composables/ | state |
| src/forms/, src/styles/ | forms |
| routes/, controllers/ | api |
| models/, migrations/ | db |
| auth/, middleware/ | auth |
| services/ | services |
| config/ | config |
| tests/ | tests |
| docs/ | docs |
| scripts/ | chore |
| .github/, ci/ | ci |
| docker/ | docker |
| infra/ | infra |
| utils/, types/ | utils |
| i18n/ | i18n |
| logs/ | logging |
| security/ | security |
| cache/ | cache |
| package.json, package-lock.json | deps |
| *.config.*, biome.json, tsconfig.json | config |

## Inference Rules

* All files same area → use that scope
* Multiple areas → omit scope
* Dependency changes → use `deps`
* CI files → use `ci`
* Build files → use `build`
* Root-level files only → omit scope

---

# Allowed Types

* feat
* fix
* refactor
* docs
* test
* chore
* perf
* style
* build
* ci
* revert

---

# Description Rules

* Use imperative mood
* Be concise
* Max 50 characters
* No capital first letter
* No trailing period

Correct:
```
feat(api): add user registration endpoint
```

Correct (no scope):
```
chore: update dependencies
```

Incorrect:
```
feat: Added new endpoint.
```

---

# Body

## 3+ Modified Files (MANDATORY)

Body MUST be included when modifying 3+ files.

## 2 or Less Modified Files (OPTIONAL)

Body is optional for 2 or fewer file changes.

Structure:
```
<1-3 line summary>

Files:
- [ADD] file: description
```

## Summary Requirements

* 1–3 lines, max 80 characters total
* Explain WHAT changed
* No emojis

---

# Files Section

The commit MUST include a full list of modified files (UNLESS body is omitted).

## Rules

* MUST include ALL modified files
* MUST use relative paths
* MUST include change prefix
* MUST keep descriptions 2–5 words

## Allowed Prefixes

* [ADD] - new file
* [MOD] - modified file
* [DEL] - deleted file
* [REN] - renamed file
* [BIN] - binary/assets (describe in commit message, not in files list)

---

# Examples

## Example 1: Inferred Scope

```
fix(api): validate user input

Add validation for email and password fields in signup endpoint.

Files:
- [MOD] routes/auth.ts: add validation middleware
- [MOD] controllers/auth.ts: validate request body
```

## Example 2: No Scope

```
chore: update dependencies

Upgrade project dependencies to latest stable versions.

Files:
- [MOD] package.json: update versions
- [MOD] package-lock.json: regenerate lockfile
```

## Example 3: Ambiguous Multiple Areas

```
feat: add user profile feature

Implement user profile with settings and preferences.

Files:
- [ADD] src/pages/Profile.vue: profile page
- [MOD] api/users.ts: user endpoint
- [ADD] components/UserCard.vue: user card
```

## Example 4: Small Change (No Body)

```
fix(ui): update button color

Files:
- [MOD] src/styles/variables.css: update primary color
```

## Example 5: Binary Assets

```
chore: add app icons

Update application icons for all platforms.

(Binary files not listed - see working directory changes)
```

## Example 6: Revert Commit

```
revert: feat(api): add user registration endpoint

Reverts previous commit that introduced user registration.
```

---

# Breaking Changes

## Option 1
```
feat(api)!: change authentication flow
```

## Option 2

Footer:
```
BREAKING CHANGE: authentication now requires token
```

---

# Absolute Rules

The AI MUST:

1. Always write commits in English
2. Infer scope when possible, omit if unclear
3. Include body for 3+ files, optional for ≤2
4. Include file list (unless body omitted)
5. Never use emojis
6. Never exceed 50 chars in description
7. Never exceed 80 chars in summary
8. Never skip Files section
9. **NEVER commit secrets, .env files, or credentials. If such files appear in changes, EXCLUDE them from commit entirely and warn the user.**

---

# Troubleshooting

## When Scope is Unclear

* If files span multiple areas → omit scope
* If only root-level files → omit scope
* If mixed file types → omit scope

## When File List is Empty

* Binary-only changes → describe in commit message
* If all files are secrets → abort and warn user

---

# AI Validation Checklist

Before outputting a commit:

* Check for secrets/.env in changes → exclude if found
* infer scope from file paths
* omit scope if ambiguous
* header format correct
* description imperative
* body present (if 3+ files)
* summary exists (if body present)
* files section exists (unless body omitted)
* prefixes correct
* no emojis
* English language
