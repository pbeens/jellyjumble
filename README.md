# Jelly Jumble

An original match-three browser game for phones and computers, maintained
with help from AI agents and hosted on GitHub Pages.

## First playable version

Swap neighboring jelly pieces to make rows or columns of three or more.
Matching pieces disappear, pieces above fall, and new pieces fill the gaps.
Cascades can create further matches.

The first version includes one board, scoring, limited moves, game over,
restart, touch and mouse controls, original visuals made in code, and simple
generated sounds with a visible mute button. Initial tuning is an 8×8 board
and 20 moves, subject to playtesting.

## Project guide

- [Agent instructions](AGENTS.md)
- [Current tasks and next steps](tasks.md)
- [Program-related request log](prompts.md)
- [Game source guide](src/README.md)
- [Changelog](changelog.md)

## Playing

Tap or click a jelly, then an adjacent one to swap. Swiping also swaps
neighbors. Make horizontal or vertical lines of at least three identical
shapes. Invalid swaps cost no move. Cascades multiply points: each matched
jelly is worth 10 points times its chain number. After 20 successful swaps,
the round ends. A board with no legal moves is automatically mixed.

Use **A little hint** to highlight an available swap without spending a move.
**Start fresh** resets the round. For keyboard play, use arrow keys to move
focus and Enter or Space to select; Escape clears the selection.

Sound starts off. The header's sound button toggles generated tones. Sound
preferences and personal bests are saved in this browser when local storage
is available. No account, external fonts, or audio service is needed. The standard Buy Me
a Coffee support button is bundled locally with the site.

Use a modern browser with JavaScript enabled. The game uses SVG, CSS Grid,
Pointer Events, Web Animations, and native dialogs. Chrome desktop and a
390×844 emulated phone layout have been checked; real-device touch and
other browsers remain on the [verification list](tasks.md).

Rounds stay in memory and reset when the page reloads. Only sound preference
and personal best are stored locally; clearing this site's browser data
removes both. The game includes no analytics, accounts, or network requests
for gameplay. The hosting provider handles ordinary website requests.

## Support and feedback

Enjoying Jelly Jumble? [Buy me a coffee](https://buymeacoffee.com/pbeens).
Found a problem? [Report it on the issues page](https://github.com/pbeens/jellyjumble/issues).
Include what happened, what you expected, and your browser/device when possible.

## Development

Use Node.js 22.12 or newer. Install locked development dependencies once:

```sh
npm ci
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development preview. |
| `npm run check` | Check JavaScript syntax and run game-rule tests. |
| `npm run build` | Replace `docs/` with the publishable website. |
| `npm run preview` | Preview the production build locally. |

The terminal prints the preview address. The stack is plain JavaScript,
HTML, and CSS with Vite; game code has no runtime package dependencies.

Open that HTTP address in your browser. Do not double-click `src/index.html`
or `docs/index.html`: browsers block game assets when opened as `file://`.
To play the built version locally, run `npm run build`, then `npm run preview`.

Editable files belong in [src/](src/README.md). The [Vite configuration](vite.config.js)
generates the [published website](docs/README.md), including folder guides
and `.nojekyll`. Never edit generated files by hand. Asset URLs are relative
so the build can live under a GitHub Pages repository path.

## GitHub Pages

Release preparation uses these commands from the project folder:

```sh
npm run check
npm audit
npm run build
npm run preview
```

Review the [release checks](tasks.md) and update the [changelog](changelog.md)
before publishing. Once publication is authorized, commit and push the source,
lockfile, documentation, and generated `docs/` together to the intended repository.

In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**,
select the branch containing the build, choose **/docs**, and save. GitHub serves
`docs/index.html` as the home page; do not include `/docs/` in the public URL.
See [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

After deployment succeeds, open the URL shown in Pages settings. Verify the
styled 64-piece board, a matching swap, restart, and that JavaScript and CSS
load successfully. Record that public URL here after it has been verified.
For updates, rebuild and commit the new `docs/` output with the source changes.

Version **0.1.0** has been released. See the [changelog](changelog.md) for
release notes and [tasks](tasks.md) for remaining verification and device checks.
