# Changelog

User-visible changes, newest first. Entries under Unreleased describe the
prepared build; they do not indicate that it has been published.

## Unreleased — 0.1.0

### Added

- Original 8×8 jelly puzzle with six pieces identified by shape and color.
- Neighbor swaps, matches of three or more, gravity, and cascading matches.
- Twenty successful moves per round, chain-based scoring, a round-complete
  screen, and restart. Invalid swaps cost no move.
- Free hints and automatic mixing when no legal moves remain.
- Responsive phone and desktop layouts, click/tap and swipe controls,
  keyboard navigation, visible focus, and reduced-motion support.
- Optional generated sound with a visible mute control, plus locally saved
  sound preference and personal best.
- Local preview, deterministic game-rule checks, and a generated GitHub Pages
  build with relative asset paths.

### Fixed

- Direct-file opens now explain how to launch the HTTP preview when browser
  restrictions prevent the game assets from loading.

### Documentation

- Added setup, gameplay, browser support, local-data behavior, and publishing
  instructions, with verification status tracked separately.

No online release has been published yet. When publishing, move these notes
under the released version and its actual release date.

[Project guide](README.md) · [Release checks](tasks.md)
