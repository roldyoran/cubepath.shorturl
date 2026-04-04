---
name: conventional-commits-enforcer
description: Enforce strict Conventional Commits format. Scope is optional and MUST be inferred automatically from modified files when possible.
license: LICENSE.txt
---

This skill enforces **strict Conventional Commits formatting** for all git commits.
All commit messages **MUST be written in English only**.

The AI MUST always generate commits following the exact structure and rules defined below.

---

# Required Commit Format

```
<type>(<scope (optional)>): <description>

<summary>

Files:
- [NEW] path/file.ext: short description
- [MOD] path/file.ext: short description
- [DEL] path/file.ext: short description
```

If no clear scope can be inferred:

```
<type>: <description>
```

---

# Commit Structure Rules

## Header

```
<type>(<scope (optional)>): <description>
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
* Scope is OPTIONAL but MUST be inferred when possible

---

# Scope Inference (MANDATORY WHEN POSSIBLE)

The AI MUST infer scope automatically using:

1. Modified file paths
2. Folder names
3. File types
4. Module names

## Folder → Scope Mapping

### Frontend

* `src/components/` → ui
* `src/pages/` → ui
* `src/router/` → router
* `src/store/` → state
* `src/forms/` → forms
* `src/styles/` → styles

### Backend

* `routes/` → api
* `controllers/` → api
* `models/` → db
* `migrations/` → db
* `auth/` → auth
* `middleware/` → middleware
* `services/` → services

### General

* `config/` → config
* `tests/` → tests
* `docs/` → docs
* `scripts/` → chore
* `infra/` → infra
* `utils/` → utils
* `types/` → types
* `i18n/` → i18n
* `logs/` → logging
* `security/` → security
* `cache/` → cache

## Inference Rules

* If all files share same area → use that scope
* If multiple areas → omit scope
* If unclear → omit scope
* If root-level files only → omit scope
* If dependency changes → use `deps`
* If CI files → use `ci`
* If build files → use `build`

---

# Allowed Types

Use ONLY one of these:

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

# Body (MANDATORY)

The body MUST always be included.

Structure:

```
<1-3 line summary>

Files:
- [NEW] file: description
```

## Summary Requirements

* 1–3 lines
* Explain WHAT changed
* No emojis
* No bullet points

---

# Files Section (MANDATORY)

The commit MUST include a full list of modified files.

## Rules

* MUST include ALL modified files
* MUST use relative paths
* MUST include change prefix
* MUST keep descriptions 2–5 words

## Allowed Prefixes

* [NEW]
* [MOD]
* [DEL]

---

# Example (Inferred Scope)

```
fix(api): validate user input

Add validation for email and password fields in signup endpoint.

Files:
- [MOD] routes/auth.ts: add validation middleware
- [MOD] controllers/auth.ts: validate request body
```

---

# Example (No Scope)

```
chore: update dependencies

Upgrade project dependencies to latest stable versions.

Files:
- [MOD] package.json: update versions
- [MOD] package-lock.json: regenerate lockfile
```

---

# Breaking Changes

Breaking changes MUST be indicated in one of two ways:

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
2. Always infer scope when possible
3. Scope MUST be omitted if unclear
4. Always include a body
5. Always include file list
6. Never use emojis
7. Never omit modified files
8. Never exceed 50 characters in description
9. Never use past tense
10. Never skip Files section

---

# AI Validation Checklist

Before outputting a commit:

* infer scope from file paths
* omit scope if ambiguous
* header format correct
* description imperative
* body exists
* summary exists
* files section exists
* prefixes correct
* no emojis
* English language
