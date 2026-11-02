# Tasks

## Current focus

Version 0.1.0 documentation and the production build are prepared.
Publication is pending the remaining checks and authorization below.

- [x] Finish release instructions, browser support, and local-data notes.
- [x] Add a linked changelog with unreleased 0.1.0 notes.
- [x] Run checks, build, dependency audit, document-link and asset verification.
- [x] Verify nested static-path rendering and record remaining browser checks.

- [x] Add direct-file guidance and rebuild generated output.
- [x] Verify the HTTP preview shows styling and 64 jellies on desktop and
      fits a 390×844 emulated phone viewport; pass game-rule checks.

## Next tasks

- [x] Implement the playable board, valid swaps, matches, gravity, cascades,
      and initial boards without existing matches.
- [x] Add scoring, limited moves, game over, and restart.
- [x] Handle boards with no available moves.
- [ ] Verify touch and mouse controls on phone and desktop layouts.
- [x] Add original visuals, generated sounds, and a persistent mute control.
- [x] Add preview, checking, and build commands.
- [ ] Verify actual rendering and gameplay under a GitHub Pages repository path.
- [ ] Publish to GitHub Pages after authorization.

## Before publication

- [ ] Check touch taps and swipes on an actual phone, including scrolling
      outside the board; check at least one additional browser.
- [ ] Finish a complete browser round: moves reach zero, score matches the
      round-complete dialog, and another round resets score and moves.
- [ ] Check help-dialog keyboard focus and closing, free hints, invalid swaps,
      and sound toggling/persistence after reload.
- [ ] Configure the intended GitHub remote and confirm the publishing branch.
- [ ] After authorization, commit and push source and generated output together;
      configure Pages to deploy from that branch's `/docs` folder.
- [ ] Verify the actual HTTPS Pages URL, board, swap, restart, and asset loads;
      add the verified URL to README.md and date the released changelog entry.

## Open questions

- No GitHub remote is configured locally. The target repository, Pages
  configuration, and public URL have not been verified.
- Native Chrome access now works. Desktop rendering, phone-sized rendering,
  and a mouse-driven matching swap with cascades are verified. Actual phone
  touch/swipe input, audio, modal focus, and a full UI round still need QA.
- The generated site was served from `/docs/` by a plain static HTTP server;
  Chrome displayed 64 pieces with styles. This confirms nested asset loading,
  while gameplay at the actual public Pages URL remains a deployment check.

## Recently completed

- Agreed on the first-version scope, original visuals, one maintainer,
  GitHub Pages hosting, and phone and desktop support.
- Created the approved setup files, source guide, and navigation links.
- Verified Markdown links, folder guidance, whitespace, and documentation
  terminology during initialization.
- Implemented original SVG jellies, responsive layouts, tap/click/swipe and
  keyboard controls, free hints, scoring, cascades, and local preferences.
- Passed nine game-rule tests, including 500 initial boards and 100 seeded
  rounds covering 2,000 successful swaps and their cascades.
- Built the production website with generated folder guides and `.nojekyll`.
- Development and production HTML previews returned HTTP 200; production
  JavaScript and CSS also returned HTTP 200. Nested asset URL and document
  link checks passed. Browser QA is pending as noted above.
- Diagnosed the plain-text screenshot: `docs/index.html` was opened with
  `file://`, blocking built assets. Opened the HTTP production preview in
  Chrome and verified all 64 jellies, styling, and a swap producing two
  cascading matches, 90 points, and 19 remaining moves.
- Checked desktop and 390×844 phone layouts visually in Chrome. Added and
  verified a direct-file notice with preview instructions, documented HTTP
  preview usage, rebuilt `docs/`, and passed all nine game-rule tests.
- Prepared release documentation and unreleased 0.1.0 changelog. Added
  browser support, local-data behavior, exact Pages publishing steps, and
  explicit live-site verification instructions linked to official GitHub docs.
- Release-preparation checks: all nine rule tests passed; production build
  succeeded; npm audit reported zero known vulnerabilities across the locked
  dependency tree; 36 local links across eight Markdown documents resolved;
  both generated asset references and `.nojekyll` were present. Static nested
  HTML returned HTTP 200 and rendered in Chrome. No dependencies were changed.
- Broader browser gameplay verification remains incomplete. The browser
  switched away from the game during the attempted follow-up round, so no
  full UI round is claimed. Existing user tabs were preserved.
