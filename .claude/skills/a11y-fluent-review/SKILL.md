---
name: a11y-fluent-review
description: Accessibility (a11y) review checklist and known pitfalls for this repo's Fluent UI v9 (@fluentui/react-components) SPFx Copilot component. Use whenever adding or changing UI in src/components — new controls, dialogs, tables, forms, status/error text, icon-only buttons, or custom color styling. Also use when the user mentions accessibility, a11y, contrast, WCAG, or color/legibility complaints about a button, badge, or text.
disable-model-invocation: false
---

# Accessibility review for this repo

This component renders inside the SharePoint Copilot Workbench using Fluent UI v9
(`@fluentui/react-components`), themed via `webLightTheme`/`webDarkTheme` from
`hostContext.theme` (see `SkillsFactoryApp.tsx`). All custom styling goes through
`makeStyles` + design tokens (`tokens.colorXxx`), never hard-coded hex values.

Target: **WCAG 2.1 AA**.
- Normal text: contrast ratio >= 4.5:1 against its background.
- Large text (18pt+/14pt+bold), icons, and UI component boundaries (e.g. a focus
  outline or a button's default border): >= 3:1.
- Never use color alone to convey meaning (pair with an icon, label, or text).

## Known pitfall: mismatched Fluent red/status token tiers (already hit once)

Fluent's palette tokens come in tiers that are **not interchangeable**:
- `colorPaletteRedBackground1` / `colorStatusDangerBackground1` — very light tint.
  Pair with `...Foreground1`/`...Foreground2` (dark red text) for text-on-light-bg.
- `colorPaletteRedBackground3` / `colorStatusDangerBackground3` — solid, saturated
  background (used for filled/destructive buttons). Pair with
  **`tokens.colorNeutralForegroundOnBrand`** (white) — never with a `Foreground1`/
  `Foreground2` token, which is tuned for a light background and produces ~2:1
  contrast (looks like near-black text on red — the exact bug filed against the
  "Delete skill" button in `SkillDetailsPanel.tsx`).

Prefer `colorStatusDanger*` over `colorPaletteRed*` for destructive actions — it
ships matching `Background3Hover`/`Background3Pressed` states, so a custom
solid/danger button gets correct hover/pressed contrast for free:

```ts
deleteConfirmButton: {
  backgroundColor: tokens.colorStatusDangerBackground3,
  color: tokens.colorNeutralForegroundOnBrand,
  ':hover': { backgroundColor: tokens.colorStatusDangerBackground3Hover, color: tokens.colorNeutralForegroundOnBrand },
  ':hover:active': { backgroundColor: tokens.colorStatusDangerBackground3Pressed, color: tokens.colorNeutralForegroundOnBrand }
}
```

Before shipping any custom background/foreground token pairing, compute the ratio
instead of eyeballing it — both light and dark theme values differ:

```bash
node -e "
const t = require('@fluentui/react-theme');
function hexToRgb(h){h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function lum([r,g,b]){const a=[r,g,b].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];}
function contrast(a,b){const l1=lum(hexToRgb(a))+0.05,l2=lum(hexToRgb(b))+0.05;return l1>l2?l1/l2:l2/l1;}
for (const name of ['webLightTheme','webDarkTheme']) {
  const th = t[name];
  console.log(name, contrast(th.colorStatusDangerBackground3, th.colorNeutralForegroundOnBrand).toFixed(2));
}
"
```

## Review checklist (apply to every component touched)

- **Icon-only `Button`s** (`icon={...}` with no visible text, e.g. close/delete/copy
  actions in `SkillDetailsPanel.tsx`) must have `aria-label`.
- **Native `<select>` elements** (used throughout instead of Fluent's `Dropdown` —
  see `CreateSkillForm.tsx`, `SkillsFactoryDashboard.tsx`) must have an associated
  accessible name: wrap in Fluent `Field`/`label`, or add `aria-label` directly.
- **`Dialog`** always needs a `DialogTitle` — it supplies the dialog's accessible
  name; don't render a dialog whose title is empty/conditional-to-nothing.
- **Status/error text** (`deleteError`, `cloneError`, `activateError`, `statusError`
  classes) must not rely on color alone — keep the leading icon or explicit wording
  ("Failed to...") rather than just tinting text red.
- **Focus visibility**: don't set `outline: none`/suppress Fluent's default focus
  ring when overriding a control's styles; if a custom background hides the ring,
  add an explicit `:focus-visible` style.
- **Loading spinners** (`Spinner label="..."`) should always carry a `label` —
  already the convention here, keep it when adding new async actions.
- **Tables** (`SkillsTable`, `SitesTable`, the sites `DataGrid` in
  `SkillDetailsPanel.tsx`) should use `createTableColumn`'s `renderHeaderCell` with
  real text, not icon-only headers, unless paired with `aria-label` on the header
  cell.
- **Images/icons conveying state** (e.g. any future status icon) need `aria-label`
  or adjacent text — Fluent icon components render as decorative SVG by default.

## When to escalate

For a broader sweep across many files at once (not a single-component tweak),
delegate to the `a11y-review-specialist` agent with this repo's Fluent v9 token
system and the pitfall above explicitly called out in the brief, since it has no
memory of this file's contents on its own.
