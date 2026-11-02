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

The game’s jelly artwork and audio are original. The support link uses
[buy-me-a-coffee.png](buy-me-a-coffee.png), the unmodified standard yellow
button from [Buy Me a Coffee’s CDN](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png).
Buy Me a Coffee provides its branded graphics for promoting creator pages
through its [Brand Kit](https://buymeacoffee.com/brand); ownership remains
with Buy Me a Coffee. The linked button retains the brand name. This is a
promotional brand asset, not project-owned or separately open-licensed art.
Keep it local so displaying the game needs no third-party image request.

See the [project overview](../README.md), [agent instructions](../AGENTS.md),
and [current tasks](../tasks.md).
