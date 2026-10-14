---
name: design-consistency
description: Visual design language and component patterns for this repo's Fluent UI v9 (@fluentui/react-components) SPFx Copilot component — accent colors, icon tiles, card/table/row states, button treatments. Use whenever adding or changing UI in src/components (new views, panels, cards, tables, buttons, badges, forms) so the result matches the rest of the app instead of introducing a new one-off style. Also use when the user asks for something to "look consistent", "match the rest of the app", "follow the design system", or mentions polish/visual quality for a new feature.
disable-model-invocation: false
---

# Design language for this repo

This component renders inside the SharePoint Copilot Workbench using Fluent UI v9
(`@fluentui/react-components`), themed via `webLightTheme`/`webDarkTheme` from
`hostContext.theme`. All styling goes through `makeStyles` + Fluent semantic design
tokens (`tokens.colorXxx`) — **never hard-coded hex values**, and never a different
UI kit. Reuse native Fluent components (`Card`, `Badge`, `Button`, `DataGrid`, ...)
instead of recreating them with raw `div`/`table` markup, except where the file
already has an established reason not to (e.g. `SitesTable.tsx` uses a plain
`<table>` for its expandable-row layout — follow that file's existing pattern
rather than introducing `DataGrid` there).

Before styling anything new, skim the closest existing analog below and copy its
pattern rather than inventing a new one. If a genuinely new pattern is needed,
also load the `a11y-fluent-review` skill before shipping it — every pairing below
has already been contrast-checked against both themes; a new one hasn't.

## Brand identity: icon tiles

Section/view headers get a small square icon tile for brand identity, not a bare
heading. Pattern (see `SkillsFactoryDashboard.tsx` `headerIconTile`,
`InlineSkillsView.tsx` `headerIconTile`, `SkillDetailsPanel.tsx` `headerIconTile`):

```ts
headerIconTile: {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',   // 32px for a denser context like a slide-over panel header
  height: '40px',
  borderRadius: tokens.borderRadiusMedium,
  backgroundColor: tokens.colorBrandBackground2,
  color: tokens.colorBrandForeground1,
  flexShrink: 0
}
```

Pair with a Fluent icon (`@fluentui/react-icons`, 24px size, e.g. `Sparkle24Regular`)
and `aria-label="..."`-free `aria-hidden="true"` on the wrapping `<span>` since the
adjacent heading text already names the section. Don't add an icon tile to every
subsection — only top-level view/panel headers (dashboard title, inline view
title, the skill details slide-over header), not every card.

## Accent-colored metric/status tiles

Three-tier accent system, reused across KPI tiles, badges, and borders — don't
invent a fourth tier or a custom hex:

| Accent    | Background                           | Foreground                           | Border                            | Use for |
|-----------|---------------------------------------|---------------------------------------|-------------------------------------|---------|
| `brand`   | `colorBrandBackground2`               | `colorBrandForeground1`               | `colorBrandStroke1`                 | Totals, neutral metrics, default emphasis |
| `success` | `colorStatusSuccessBackground1`       | `colorStatusSuccessForeground1`       | `colorStatusSuccessBorder1`         | Positive/"has X" states |
| `warning` | `colorStatusWarningBackground1`       | `colorStatusWarningForeground1`       | `colorStatusWarningBorder1`         | Coverage gaps, "needs attention" |
| `danger`  | `colorStatusDangerBackground1`/`3`    | see `a11y-fluent-review`'s tier note  | —                                    | Destructive actions only (buttons, not tiles) |

The canonical implementation is `KPI_ACCENT_STYLES` in
`src/components/fullscreen/SkillsFactoryDashboard.tsx` — a module-level
`Record<Accent, {background, foreground, border}>` consumed by a card that
renders: a 3px `borderLeft` in the accent's border color, a circular icon tile
(28px, accent background/foreground) next to the label, and the big number
rendered in the accent foreground color. Copy that shape for any new
metric/stat tile instead of a plain `CardHeader` + unstyled number.

For a single inline status (not a tile), use a Fluent `Badge` instead of colored
`Text` — `appearance="tint"` + `color="success"|"warning"|"informative"|"brand"`
+ an `icon` prop so the state isn't color-only (see `SitesTable.tsx`'s
"Has skills"/"No skills" badge, `SkillDetailsPanel.tsx`'s site-count badge).

## Interactive surfaces: hover, selected, focus

- **Table/list row hover**: `backgroundColor: tokens.colorSubtleBackgroundHover`.
  This is the one correct token for "hoverable row" — don't reuse
  `colorNeutralBackground2`/`3` for hover (those are for static tinted surfaces,
  e.g. a header row or an expanded details row).
- **Selected row/card**: `backgroundColor: tokens.colorSubtleBackgroundSelected`
  for a neutral multi-select context (table rows), or
  `tokens.colorBrandBackground2` + a brand-colored left border for a single
  "this is the emphasized/primary one" context (the top-ranked skill in
  `InlineSkillsList.tsx`, a selected `SkillCards` card). Don't use
  `colorNeutralBackground3` for "selected" — it reads as generic disabled-gray,
  not as an intentional selection.
- **Custom `<button>`-styled controls** (chart bars, donut legend buttons,
  anything that isn't a Fluent `Button`) always get both:
  ```ts
  ':hover': { backgroundColor: tokens.colorSubtleBackgroundHover },
  ':focus-visible': { outline: `2px solid ${tokens.colorStrokeFocus2}`, outlineOffset: '2px' }
  ```
  A plain Fluent `Button`/`DataGridRow` already has correct states out of the
  box — don't add these to them.
- **Clickable `Card`s**: add a hover lift, not just a color change —
  `boxShadow: tokens.shadow4` + `transform: 'translateY(-1px)'` (see
  `SkillCards.tsx` `cardClickable`, `InlineSkillsList.tsx` `row`).
- Table header rows get a `colorNeutralBackground2` background to separate them
  from body rows (see `headerCell`/`headerRow` in `SkillsTable.tsx` /
  `SitesTable.tsx` / the sites grid in `SkillDetailsPanel.tsx`).

## Buttons

- Primary call-to-action: Fluent `appearance="primary"` (brand color) — already
  the convention for "Create Skill", "Delete skill" (destructive variant below),
  "Activate feature". Don't hand-roll a colored button when `appearance="primary"`
  or `appearance="secondary"` already does it.
- Destructive buttons (e.g. a delete confirmation) use the
  `colorStatusDangerBackground3` + `colorNeutralForegroundOnBrand` pairing — see
  the `a11y-fluent-review` skill's "known pitfall" section before writing a new
  one; mismatching the token tier here is the single most common mistake.

## Griffel/makeStyles gotcha: don't mix shorthand and longhand border props

If two style slots in the same `makeStyles` call are merged onto one element
(e.g. a base `row` class plus a modifier `rowTop` class), every slot must use
the **same form** for a given CSS property. Setting `border: '1px solid ...'`
(shorthand) in one slot and `borderColor: '...'` (longhand) in a sibling slot
that's combined with it fails TypeScript with a confusing
`Type 'string' is not assignable to type 'undefined'` error at the longhand
property — Griffel's type system treats shorthand and longhand for the same
property as mutually exclusive across merged slots. Fix: use the same shorthand
form (e.g. `border: `1px solid ${tokens.colorBrandStroke2}`` ) in every slot
that touches that property, even if you only mean to override the color.

## When to escalate

For a broad visual pass across many files at once (not a single new
component), prefer doing the inspection yourself first (skim 2–3 existing
files matching the kind of UI being added) rather than guessing a new pattern
— this repo's design intentionally reuses a small, fixed vocabulary of accents
and states rather than per-component bespoke styling.
