# Jelly Jumble — Agent Guide

## Purpose and scope

Build an original, mobile-friendly match-three browser game for GitHub Pages.
This is a personal project with one maintainer.

The first version includes neighboring-piece swaps, matches of three or more,
gravity and cascades, scoring, limited moves, restart, original jelly visuals,
and optional generated sound with a visible mute control.

Use Jelly Jumble's own identity and terminology throughout the project.
Do not name other commercial games in project documentation or prompt logs.

## Start here

Read this file first, then README.md. Read tasks.md before active work and
update it after completing and verifying a task.

Keep this file concise and durable. Do not turn it into a session log or
changelog. Store active plans and changing tasks in tasks.md.

## Folder map

- [README.md](README.md): project overview, navigation, and usage instructions.
- [AGENTS.md](AGENTS.md): stable project and agent instructions.
- [prompts.md](prompts.md): program-related user request summaries.
- [changelog.md](changelog.md): user-visible changes and release history.
- [tasks.md](tasks.md): current focus, next tasks, and open questions.
- [src/](src/README.md): game source and organization conventions.
- [docs/](docs/README.md): generated GitHub Pages output; never edit by hand.
- [package.json](package.json): preview, checking, and build commands.
- [vite.config.js](vite.config.js): build output and generated folder guides.

Add other folders only when a concrete artifact requires them. Shared
utilities belong in `scripts/`; reusable agent workflows belong in `skills/`;
longer project documents belong in `project-docs/`. Create those folders
only when needed.

## Implementation conventions

Use plain JavaScript, HTML, and CSS, with Vite for preview and builds.
Keep the implementation small and understandable.

Support phones and computers with touch and mouse input. Do not rely on
hover alone. Provide readable text, visible keyboard focus, and accessible
names for controls. Identify pieces by shape as well as color.

Create original visuals in code. Use generated audio where practical.
Include a visible mute button and remember the sound preference.
Begin audio only after a user interaction.

Use lowercase kebab-case for new folders and ordinary source filenames.
Keep source materials separate from generated output.

## Working rules

- Inspect relevant files and preserve existing user changes.
- State assumptions and surface consequential ambiguities.
- Plan non-trivial work as small, reviewable tasks in tasks.md.
- Define and verify a concrete success criterion for each task.
- Make only changes needed for the requested outcome.
- Ask before major structural changes.
- Obtain authorization before installing dependencies, deleting or moving
  existing work, committing, pushing, or publishing. Existing authorization
  for the current task applies; do not ask again for an authorized action.
- Verify game rules and check phone and desktop layouts after relevant changes.
- Record completed work, verification, and remaining issues in tasks.md.

## Prompt traceability

Record every program-related user prompt in root-level prompts.md.
Prepend new entries in strict reverse chronological order.

Each entry must contain a local ISO-like timestamp with UTC offset, a short
goal line, a concise paraphrased summary, and the active computer hostname.
Add technical context only when useful. Use America/Winnipeg for local
timestamps. Do not invent timestamps for earlier messages; label
retrospective entries when necessary and preserve their known message order.

Do not log unrelated administrative or meta prompts, private secrets,
verbatim conversation, task lists, or change history. Preserve the requested
outcome using the project's own terminology.

If writing the log fails, report the failure and continue the work.

## Documentation and workflows

Keep README.md navigation and the folder map current when structure changes.
Link every new document from the nearest relevant README or index using
relative Markdown links.

Every new organizational folder must include a concise README.md: purpose,
contents, exclusions, and relevant naming, sourcing, or generation conventions.

For generated folders recreated by a build, generate their README as part
of the build. Website builds must place output in `docs/` and generate its
README. Keep website source in `src/`.

Avoid detailed task lists inside core deliverables. Identify recurring work
patterns and propose a focused reusable skill when it would save effort.
Do not create speculative workflows.

> [!NOTE]
> This project was initialized using the agentic master prompt provided by [AgenticProjectInitializer](https://github.com/pbeens/AgenticProjectInitializer/blob/main/master-prompt.md).
