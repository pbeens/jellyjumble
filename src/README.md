# Game source

This folder holds Jelly Jumble's editable HTML, CSS, and JavaScript,
including original jelly visuals made in code and generated sound behavior.

- [index.html](index.html): page structure, controls, and instructions.
- [style.css](style.css): responsive layout, jelly styling, and reduced-motion rules.
- [main.js](main.js): input, animations, round state, local preferences, and audio.
- [game.js](game.js): pure board rules, matching, gravity, and legal moves.
- [game.test.js](game.test.js): deterministic rule checks and simulated rounds;
  run with `npm run check` from the project root.

Use lowercase kebab-case filenames and keep modules focused on concrete
responsibilities. Keep the interface usable with touch and mouse on phones
and computers.

Do not store generated website output, dependencies, secrets, or temporary
files here. `npm run build` writes to [docs/](../docs/README.md) instead.

No external artwork or audio is needed for the first version. If external
materials are introduced later, record their source, license, and required
attribution alongside them before use.

See the [project overview](../README.md), [agent instructions](../AGENTS.md),
and [current tasks](../tasks.md).
